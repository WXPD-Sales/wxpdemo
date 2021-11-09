// server.js
require('dotenv').config();
// init project
const base64url = require('base64url');
const express = require("express");
const bodyParser = require("body-parser");
const RedisExpiredEvents = require("./redis-expired-events");
const expiry = require("./expiry");
const app = express();
const fs = require('fs');
const path = require('path');
const thismoment = require("moment");
const url = require("url");
const randomize = require("randomatic");
const session = require("express-session");
const RedisRepo = require("./redis-repo");
const rr = new RedisRepo();
const tokgen = require("./token-generator");
const email_validator = require("email-validator");
const request = require("request");
var webex = require('webex/env');
//sentry.io
/*
const Sentry = require("@sentry/node");
Sentry.init({
  dsn:
    "https://f453e51294d34cdb9a2962000f5612e3@o450029.ingest.sentry.io/5434024"
});*/

// config express-session
var sess = {
  secret: "CHANGE THIS TO A RANDOM SECRET",
  //cookie: { sameSite: 'none', secure:false, httpOnly:true },
  cookie: {  },
  resave: false,
  saveUninitialized: true
};

const redirect_uri = encodeURIComponent(new URL(path.join(process.env.MY_ROUTE, 'create_token'), process.env.BASE_URL));
console.log(redirect_uri);
const AUTH_URL = `https://webexapis.com/v1/authorize?client_id=${process.env.WEBEX_AUTH_CLIENT}&response_type=code&redirect_uri=${redirect_uri}&scope=${process.env.WEBEX_AUTH_SCOPES}`;
console.log(AUTH_URL);

const cookieOptions = { maxAge: 40000, secure:true, sameSite: "lax"}

if (app.get("env") === "production") {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;
  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  app.set("trust proxy", 1);
}

app.use(session(sess));

//app.engine('pug', require('pug').__express)
//app.set("view engine", "pug");
//app.set('views', __dirname + '/public');

var router = express.Router();
// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

function redirect(res, url){
  res.redirect(`${process.env.MY_ROUTE}${url}`);
}

router.get(`/`, function (req, res, next) {
  redirect(res, `/linkgen`);
});

router.use(express.static("public"));

// parse application/json
router.use(bodyParser.json());

router.get(`/linkgen`, function (req, res, next) {
  console.log('in linkgen')
  if(req.session.userToken){
    console.log('loading linkgen');
    //res.render('linkgen', {});
    res.sendFile(__dirname + `/public/linkgen.html`);
  } else {
    res.redirect(`${AUTH_URL}&state=linkgen`);
  }
});

router.get(`/login`, function (req, res, next) {
  console.log(req.session);
  if(req.session.codeComplete){
    let returnTo = req.session.returnTo;
    delete req.session.returnTo;
    if(returnTo == null || returnTo == undefined){
      returnTo = `${process.env.MY_ROUTE}/linkgen`;
    }
    redirect(res, `/linkgen`);
  } else {
    res.sendFile(__dirname + `/public/login.html`);
  }
});

router.post(`/code`, function(req, res, next) {
  console.log(req.body);
  rr.set(req.body.session, req.body.code, 600)
    .then(() => {
      console.log('stored code');
      res.sendStatus(200);
    })
    .catch(function(err) {
      console.log(err.message);
      res.sendStatus(400);
    });
})

router.post(`/confirm`, function(req, res, next) {
  rr.get(req.session.sessionId).then(result => {
    if(parseInt(result) != parseInt(req.body.code)){
      res.json({"status":"failure", "message":"Code doesn't match.  Try again."});
    } else {
      req.session.codeComplete = true;
      let returnTo = req.session.returnTo;
      delete req.session.returnTo;
      req.session.save();
      if(returnTo == null || returnTo == undefined){
        returnTo = `${process.env.MY_ROUTE}/linkgen`;
      }
      res.json({"status":"success", "message":"", "url":returnTo});
    }
  }).catch(function(err) {
    console.log(err.message);
    res.json({"status":"failure", "message":"Code Expired. Refresh this page."});
  });
})

router.post(`/verify`, function(req, res, next) {
  console.log('verify');
  console.log(req.body);
  if(req.body.phoneNumber.length == 10){
    req.body.phoneNumber = "1"+req.body.phoneNumber;
  }
  if(!req.body.phoneNumber.startsWith("+")){
    req.body.phoneNumber = "+" + req.body.phoneNumber;
  }
  console.log(req.body.phoneNumber);
  let sessionId = randomize("Aa0", 16);
  req.session.sessionId = sessionId;
  request.post({
      url: process.env.IMIHOOK,
      json: {
        number: req.body.phoneNumber,
        session: sessionId,
        redirect_uri: `https://${req.get("host")}${process.env.MY_ROUTE}/code`
      }
    },function(error, resp, body) {
        if (!error && resp.statusCode === 200) {
          console.log('success to imi');
          res.send('true')
        } else {
          res.send('false')
        }
      }
    );
})

function setRenderedCookies(res, userType, redisStore, token, label){
  res.cookie("userType", userType, cookieOptions);
  if(userType == "guest"){
    res.cookie("token", tokgen(redisStore.display_name).token, cookieOptions);
    res.cookie("label", redisStore.display_name, cookieOptions);
  } else {
    res.cookie("token", token, cookieOptions);
    res.cookie("label", label, cookieOptions);
  }
  res.cookie("target", redisStore.sip_target, cookieOptions);
  res.cookie("destinationType", redisStore.destination_type, cookieOptions);
  //let backgroundImage = 'https://cdn.glitch.com/e627e173-ddba-434f-ad34-e11549d64430%2F1_Ud5vq4XLOohhVKT1Nv94NQ.png?v=1585690687557';
  let backgroundImage = 'images/hero-seethrough1.webp';
  if(["", null, undefined].indexOf(redisStore.background_url) < 0){
    backgroundImage = redisStore.background_url;
  }
  res.cookie("backgroundImage", backgroundImage, cookieOptions);
  return res;


}

function renderFunc(req, res) {
  rr.get(`URL:${req.params.guest_session_id}`).then(result => {
    if (result == 1) {
      rr.get(req.params.guest_session_id).then(result => {
        if(req.session.codeComplete){
          parts = req.originalUrl.split("/");
          console.log(parts);
          res = setRenderedCookies(res, "guest", JSON.parse(result));

          res.sendFile(__dirname + `/public/${parts[2]}.html`);
        } else {
          req.session.returnTo = req.originalUrl;
          redirect(res, `/login`);
        }
      });
    } else {
      res.send({ message: `this link has expired` });
    }
  });
}

let useFiles = {"guest":"guest", "widget":"widget", "licensed":"guest", "licensed-widget":"widget", "licensed-sms":"guest"}
function quickRenderFunc(req, res) {
  parts = req.originalUrl.split("/");
  console.log(parts);
  let useFile = parts[2];
  if(useFile.indexOf("?") > 0) useFile = useFile.split("?")[0];
  useFile = useFiles[useFile];
  res.sendFile(__dirname + `/public/${useFile}.html`);
}

router.get(`/widget`, quickRenderFunc);
router.get(`/guest`, quickRenderFunc);
router.get(`/widget/:guest_session_id`, renderFunc);
router.get(`/guest/:guest_session_id`, renderFunc);

router.use(`/widget`, express.static(__dirname + '/public'));
router.use(`/guest`, express.static(__dirname + '/public'));



function renderLicensedFunc(req, res) {
  rr.get(`URL:${req.params.guest_session_id}`).then(result => {
    if (result == 1) {
      rr.get(req.params.guest_session_id).then(result => {
        parts = req.originalUrl.split("/");
        console.log(parts);
        if(req.session.userToken){
          request.get({
              url: 'https://webexapis.com/people/me',
              headers: { 'Authorization': `Bearer ${req.session.userToken}` }
            },function(error, resp, body) {
                console.log(body);
                if (!error && resp.statusCode === 200) {
                  selfBody = JSON.parse(body);
                  redisStore = JSON.parse(result);
                  res = setRenderedCookies(res, "licensed", redisStore, req.session.userToken, selfBody.displayName);
                  res.sendFile(__dirname + `/public/${useFiles[parts[2]]}.html`);
                } else {
                  res.json(error);
                }
              }
            );
        } else {
          res.redirect(`${AUTH_URL}&state=${parts[2]}/${req.params.guest_session_id}`);
        }
      });
    } else {
      res.send({ message: `this link has expired` });
    }
  });
}

router.get(`/licensed`, quickRenderFunc);
router.get(`/licensed-widget`, quickRenderFunc);
router.get(`/licensed-sms`, quickRenderFunc);
router.get(`/licensed/:guest_session_id`, renderLicensedFunc);
router.get(`/licensed-widget/:guest_session_id`, renderLicensedFunc);
router.get(`/licensed-sms/:guest_session_id`, renderLicensedFunc);

router.use(`/licensed`, express.static(__dirname + '/public'));
router.use(`/licensed-widget`, express.static(__dirname + '/public'));
router.use(`/licensed-sms`, express.static(__dirname + '/public'));


function isRoomId(myTarget){
  let result = base64url.decode(myTarget);
  return result.indexOf('ciscospark://us/ROOM/') >= 0;
}

router.get(`/create_token`, function(req, res, next) {
  let redirectURI = `https://${req.get("host")}${process.env.MY_ROUTE}${req.route.path}`;
  console.log(`/create_token redirectURI: ${redirectURI}`);
  request.post({
      url: 'https://webexapis.com/access_token',
      form: {
        grant_type: 'authorization_code',
        client_id: process.env.WEBEX_AUTH_CLIENT,
        client_secret: process.env.WEBEX_AUTH_SECRET,
        code: req.query.code,
        redirect_uri: redirectURI
      }
    },function(error, resp, body) {
      console.log(body);
        if (!error && resp.statusCode === 200) {
          jbody = JSON.parse(body);
          console.log(req.query.state);
          req.session.userToken = jbody.access_token;
          request.get({
              url: 'https://webexapis.com/people/me',
              headers: { 'Authorization': `Bearer ${req.session.userToken}` }
            },function(error, resp, body) {
              console.log(body);
                if (!error && resp.statusCode === 200) {
                  jbody = JSON.parse(body);
                  //req.session.avatar = jbody.avatar;
                  req.session.save();
                  res.cookie('avatar', jbody.avatar);
                  redirect(res, `/${req.query.state}`);
                } else {
                  res.json(error);
                }
              }
            );
        } else {
          res.json(error);
        }
      }
    );
});

function generateLinks(req, res, Urlexpiry, destinationType){
  let urlPaths = {"guest":["guest", "widget"], "licensed": ["licensed", "licensed-widget", "licensed-sms"]};
  let respObjects = {};
  let rrPromises = [];
  for(let i in urlPaths){
    let guestSessionID = randomize("Aa0", 16);
    let displayName = i.charAt(0).toUpperCase() + i.slice(1);//capitalize first letter
    req.body.display_name = displayName
    req.body.destination_type = destinationType
    let rrPromise = rr.setURL(guestSessionID, JSON.stringify(req.body), Urlexpiry)
      .then(() => {
        respObjects[displayName] = [];
        for(let j in urlPaths[i]){
          respObjects[displayName].push(`${process.env.BASE_URL}${process.env.MY_ROUTE}/${urlPaths[i][j]}/${guestSessionID}`);
        }
      })
      .catch(function(err) {
        console.log(err.message);
      });
    rrPromises.push(rrPromise);
  }
  Promise.all(rrPromises).then(results => {
    console.log(respObjects);
    res.send({
      result: "OK",
      message: "Session Created",
      urls: respObjects,
      expires: `in ${thismoment.duration(Urlexpiry, "seconds").humanize()}`
    });
  })
}


router.post(`/create_url`, function(req, res) {
  if (req.body.expire_hours || req.body.expiry_date) {
    if(email_validator.validate(req.body.sip_target) || isRoomId(req.body.sip_target) || ["pmr", "ad_hoc"].indexOf(req.body.sip_target) >= 0){
      let Urlexpiry = req.body.expire_hours * 60 * 60 //convert hours to seconds;
      if(req.body.expiry_date){
        Urlexpiry = Math.round(
          expiry.calculateSeconds(
            thismoment().utcOffset(req.body.offset * -1),
            req.body.expiry_date
          )
        );
      }
      console.log(req.body);
      console.log(`Urlexpiry: ${Urlexpiry}`);
      let destinationType = 'sip';
      if(req.body.sip_target == "pmr"){
        request.get({
            url: 'https://webexapis.com/v1/meetingPreferences/personalMeetingRoom',
            headers: { 'Authorization': `Bearer ${req.session.userToken}` }
          }, function(error, resp, body) {
              console.log(`body: ${body}`);
              if (!error && resp.statusCode === 200) {
                jbody = JSON.parse(body);
                console.log(jbody['personalMeetingRoomLink']);
                req.body.sip_target = jbody['personalMeetingRoomLink'];
                generateLinks(req, res, Urlexpiry, destinationType);
              } else {
                res.json(error);
              }
            }
          );
      } else if(req.body.sip_target == "ad_hoc"){
        console.log("AD HOC!");
        let start_date = new Date(new Date().getTime() + (90 * 1000))//90 seconds in the future
        let end_date = new Date(start_date.getTime() + (1 * 60 * 60 * 1000));//1 hour after start_date
        console.log(start_date.toISOString());
        console.log(end_date.toISOString());
        let createBody = {"title":"Ad Hoc Guest Demo Meeting",
                      "start":start_date,
                      "end":end_date,
                      "allowAnyUserToBeCoHost":true,
                      "allowAuthenticatedDevices":true,
                      "enableAutomaticLock":false,
                      "enableConnectAudioBeforeHost":true,
                      "enabledAutoRecordMeeting":false,
                      "enabledJoinBeforeHost":true,
                      "sendEmail":false
                      }
        request.post({
            url: 'https://webexapis.com/v1/meetings',
            headers: { 'Authorization': `Bearer ${req.session.userToken}`, 'Content-Type':'application/json' },
            body: JSON.stringify(createBody)
          }, function(error, resp, body) {
              console.log(`/meetings response body: ${body}`);
              if (!error && resp.statusCode === 200) {
                jbody = JSON.parse(body);
                console.log(jbody['sipAddress']);
                req.body.sip_target = jbody['sipAddress'];
                generateLinks(req, res, Urlexpiry, destinationType);
              } else {
                res.json(error);
              }
            }
          );
      }else {
        if(req.session.userToken != undefined){
          request.get({
              url: `https://webexapis.com/v1/people?email=${req.body.sip_target}`,
              headers: { 'Authorization': `Bearer ${req.session.userToken}` }
            },function(error, resp, body) {
                console.log(body);
                if (!error && resp.statusCode === 200) {
                  jbody = JSON.parse(body);
                  if(jbody['items'].length != 0) destinationType = 'email';
                }
                generateLinks(req, res, Urlexpiry, destinationType);
              }
            );
        } else {
          generateLinks(req, res, Urlexpiry, destinationType);
        }
      }
    } else {
      res.send({
        result: "Error",
        message: "Invalid SIP URI or RoomId!"
      });
    }
  } else {
    res.send({
      result: "Error",
      message: "Invalid Expiry Date provided!"
    });
  }
});

function sendCreateCard(destination){
  let rawCard = fs.readFileSync(__dirname +'/cards/create.json');
  let card = JSON.parse(rawCard);
  sendCard(card, destination);
}

function sendLinksCard(destination, target, urls, expires_msg){
  let rawCard = fs.readFileSync(__dirname +'/cards/links.json');
  let card = JSON.parse(rawCard);
  card.body[1].columns[1].items[0].text = target;
  card.body[2].columns[1].items[0].text = expires_msg;
  for(let demoType in urls){
    for(let url of urls[demoType]){
      let connectType = "Browser SDK";
      if(url.indexOf("widget") >= 0){
        connectType = "Widget";
      }
      let title = demoType + " " + connectType
      card.body[3].choices.push({
        "title": `[${title}](${url})`,
        "value": url
      })
    }
  }
  sendCard(card, destination);
}


function sendCard(card, destination){
  let message = {   "roomId":destination,
                    "markdown":"Guest Demo AdaptiveCard",
                    "attachments":[
                        {
                            "contentType": "application/vnd.microsoft.card.adaptive",
                            "content": card
                        }
                    ]
                }
  webex.messages.create(message).then(function(res){
    console.log('sendCard messages.create:');
    console.log(res);
  });
}

router.post(`/bot`, function(req, res) {
  if(req.body.actorId != process.env.WEBEX_BOT_ID){
    console.log(req.body)
    sendCreateCard(req.body.data.roomId);
    res.send('OK');
  }
});


router.post(`/card`, function(req, res) {
  if(req.body.actorId != process.env.WEBEX_BOT_ID){
    webex.attachmentActions.get(req.body.data.id).then(function(result){
      //console.log(`/card res:${res}`)
      console.log(result);
      if(result.inputs.submit == "create"){
        let new_data = {}
        new_data.sip_target = result.inputs.destination;
        let expire_hours = result.inputs.expires_in;
        console.log(expire_hours);
        new_data.expire_hours = parseInt(expire_hours,10);//getExpireDate(expire_hours);
        console.log(new_data.expire_hours);
        new_data.offset = 0;
        request.post({
              url: `http://localhost:${process.env.PORT}${process.env.MY_ROUTE}/create_url`,
              headers: {'content-type' : 'application/json'},
              body:    JSON.stringify(new_data)
          }, function(error, response, createResult){
            console.log(createResult);
            jresult = JSON.parse(createResult);
            if(jresult.result == "Error"){
              webex.messages.create({"roomId":req.body.data.roomId, "markdown":jresult.message});
            } else {
              sendLinksCard(req.body.data.roomId, result.inputs.destination, jresult.urls, jresult.expires);
            }
          }
        )
      } else if(result.inputs.submit == "links"){
        //webex.messages.create({"roomId":req.body.data.roomId, "markdown":phone});
        let message = "";
        let new_data = {}
        new_data.number = result.inputs.phone;
        new_data.url = result.inputs.url;
        if(new_data.url == null){
          message = "You must select one of the url choices in the card."
          webex.messages.create({"roomId":req.body.data.roomId, "markdown":message});
        } else {
          request.post({
                url: `http://localhost:${process.env.PORT}${process.env.MY_ROUTE}/sms`,
                headers: {'content-type' : 'application/json'},
                body:    JSON.stringify(new_data)
            }, function(error, response, body){
              console.log(body);
              jresult = JSON.parse(body);
              if(jresult.status == "failure"){
                message = jresult.message;
              } else {
                message = `Success - [Link](${result.inputs.url}) sent to ${result.inputs.phone} (be sure to check your spam)!`;
              }
              webex.messages.create({"roomId":req.body.data.roomId, "markdown":message});
            }
          )
        }
      }
    })
    res.send('OK');
  }
});


router.post(`/sms`, function(req, res, next) {
  console.log('sms');
  console.log(req.body);
  let status = "success"
  let message = "";
  if(req.body.number == null){
    message = "No phone 'number' key provided."
  } else if(req.body.url == null){
    message = "No 'url' key provided."
  }

  let number = req.body.number;
  number = number.replace(/[^0-9]/g, "");//remove anything that isn't a number

  if(number.length == 10){
    number = "1"+number;
  }

  if(number.length != 11){
    message = "Phone number must be a 10 digit US/Canadian number."
  }

  if(message != ""){
    status = "failure";
  }
  //TODO: Make sure PMRs work for destinationType in widget and check joining PMR alone (wait to addMedia for JOIN - see bridgeCall)
  if(status == "success"){
    request.post({
        url: process.env.IMISMS_RELAY,
        json: {
          number: number,
          message: req.body.url
        }
      },function(error, resp, body) {
          if (!error && resp.statusCode === 200) {
            console.log('success to imi');
          } else {
            console.log(error);
            status = "failure";
            message = `An error occurred sending the SMS to ${number}`;
          }
          res.send({"status":status, "message":message});
        }
      );
  } else {
      res.send({"status":status, "message":message});
  }
})

app.use(`${process.env.MY_ROUTE}`, router);
// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

RedisExpiredEvents();
