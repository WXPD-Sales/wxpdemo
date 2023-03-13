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

const nodemailer = require('nodemailer');
//const mailgun = require("mailgun-js");

const { HttpRequest} = require("@aws-sdk/protocol-http");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { SignatureV4 } = require("@aws-sdk/signature-v4");
const { NodeHttpHandler } = require("@aws-sdk/node-http-handler");
const { Sha256 } = require("@aws-crypto/sha256-browser");

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
app.use(express.static("public"));
app.use(`${process.env.MY_ROUTE}`, express.static("public"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var router = express.Router();
// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

// parse application/json
router.use(bodyParser.json());


router.get(`/linkgen`, function (req, res, next) {
  res.redirect(`/`);
});

router.get(`/`, function (req, res, next) {
  console.log('in linkgen')
  if(req.session.userToken){
    console.log('loading linkgen');
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
      returnTo = `/`;
    }
    res.redirect(`/`);
  } else {
    res.sendFile(__dirname + `/public/login.html`);
  }
});

function storeCode(sessionId, code, res){
  rr.set(sessionId, code, 600)
    .then(() => {
      console.log('stored code');
      if(res !== undefined){
        res.sendStatus(200);
      }
      
    })
    .catch(function(err) {
      console.log(err.message);
      if(res !== undefined){
        res.sendStatus(400);
      }
    });
}

router.post(`/code`, function(req, res, next) {
  console.log(req.body);
  storeCode(req.body.session, req.body.code, res);
})

router.post(`/confirm`, function(req, res, next) {
  rr.get(req.session.sessionId).then(result => {
    if(parseInt(result) != parseInt(req.body.code) && req.body.code != process.env.SMS_BYPASS_CODE){
      res.json({"status":"failure", "message":"Code doesn't match.  Try again."});
    } else {
      req.session.codeComplete = true;
      let returnTo = req.session.returnTo;
      delete req.session.returnTo;
      req.session.save();
      if(returnTo == null || returnTo == undefined){
        returnTo = `/`;
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
  if(req.body.hasOwnProperty("phoneNumber")){
    let number = validatePhoneNumber(req.body.phoneNumber);
    console.log(number);
    if(number == false){
      res.send('false');
    } else {
      let sessionId = randomize("Aa0", 16);
      req.session.sessionId = sessionId;
      request.post({
          url: process.env.IMIHOOK,
          json: {
            number: number,
            session: sessionId,
            redirect_uri: `https://${req.get("host")}/code`
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
    }
  } else if(req.body.hasOwnProperty("email")){
    if(validateEmail(req.body.email) == false){
      res.send({"status":"failure", "message":'Email address entered is not valid.'});
    } else {
      let sessionId = randomize("Aa0", 16);
      req.session.sessionId = sessionId;
      let code = randomize("0", 4);
      console.log('code');
      console.log(code);
      storeCode(sessionId, code);
      sendEmail(req.body.email, "Your Guest Link Auth Code", code, res);
    }
  } else {
    res.send('false');
  }
})

function validatePhoneNumber(number){
  number = number.replace(/[^0-9]/g, "");//remove anything that isn't a number
  if(number.startsWith('00')){
    number = number.slice(2)
  } else if(number.startsWith('0')){
    number = number.slice(1)
  }

  if(/^(353)\d{7,10}$/.test(number)){
    //Irish Number, valid
  } else if(/^(44)\d{6,12}$/.test(number)) {
    //UK Number, valid
  } else if(/^(61)\d{9,10}$/.test(number)) {
    //AUS Number, valid
  }else {
    //default to US/Canada
    if(number.length == 10){
      number = "1"+number;
    }
    if(number.length != 11){
      return false
    }
  }
  return "+" + number;
}

function validateEmail(email){
  let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function setRenderedCookies(sessionId, res, userType, redisStore, token, label){
  res.cookie("session_id", sessionId, cookieOptions)
  res.cookie("userType", userType, cookieOptions);
  if(userType == "guest"){
    let name = "Guest";
    res.cookie("token", tokgen(name).token, cookieOptions);
    res.cookie("label", name, cookieOptions);
  } else {
    res.cookie("token", token, cookieOptions);
    res.cookie("label", label, cookieOptions);
  }
  //let backgroundImage = 'https://cdn.glitch.com/e627e173-ddba-434f-ad34-e11549d64430%2F1_Ud5vq4XLOohhVKT1Nv94NQ.png?v=1585690687557';
  let backgroundImage = process.env.DEFAULT_BACKGROUND_IMG;
  if(["", null, undefined].indexOf(redisStore.background_url) < 0){
    backgroundImage = redisStore.background_url;
  }
  res.cookie("backgroundImage", backgroundImage, cookieOptions);

  let meetButtonColor = redisStore.meet_button_color;
  if(meetButtonColor !== undefined){
    meetButtonColor = meetButtonColor.replace("#","");
  }
  res.cookie("meetButtonColor", meetButtonColor, cookieOptions);

  let deleteItems = ["expire_hours", "expires_in", "expiry_date", "background_url", "meet_button_color"];
  for(let i of deleteItems){
    delete redisStore[i];  
  }

  console.log("redisStore");
  console.log(redisStore);

  //redisStore[options] can include:
  // ['sip_target', 'destination_type', 'header_toggle', 'listen_only_option', 'share_only_option', 'self_view', 'sms_button', 
  //  'show_email', 'auto_dial', 'socket_url',]
  for(let option of Object.keys(redisStore)){
    res.cookie(option, redisStore[option], cookieOptions);
  }
  
  if(!redisStore.socket_url){
    res.cookie('socket_url', process.env.SOAPBOX_URL, cookieOptions);
  }

  res.cookie("rootUrl", `${process.env.BASE_URL}/`, cookieOptions);
  return res;
}

function getCorrectFileName(originalUrl){
  parts = originalUrl.split("/");
  console.log('getCorrectFileName:');
  console.log(parts);
  let useFile = parts[1];
  if(originalUrl.indexOf(process.env.MY_ROUTE) >= 0){
    useFile = parts[2];
  }
  console.log(`useFile:${useFile}`);
  return useFile;
}

let useFiles = {"guest":"guest", "widget":"widget", "guest-widget":"widget", "licensed":"guest", "licensed-widget":"widget", "licensed-sms":"guest", "hidden":"guest"}
function quickRenderFunc(req, res) {
  let useFile = getCorrectFileName(req.originalUrl);
  if(useFile.indexOf("?") > 0) useFile = useFile.split("?")[0];
  useFile = useFiles[useFile];
  res.sendFile(__dirname + `/public/${useFile}.html`);
}


function renderFunc(req, res) {
  rr.get(`URL:${req.params.guest_session_id}`).then(result => {
    if (result == 1) {
      rr.get(req.params.guest_session_id).then(result => {
        if(req.session.codeComplete){
          let useFile = getCorrectFileName(req.originalUrl);
          res = setRenderedCookies(req.params.guest_session_id, res, "guest", JSON.parse(result));
          res.sendFile(__dirname + `/public/${useFiles[useFile]}.html`);
        } else {
          req.session.returnTo = req.originalUrl;
          //redirect(res, `/login`);
          res.redirect(`/login`);
        }
      });
    } else {
      res.send({ message: `this link has expired` });
    }
  });
}


function renderLicensedFunc(req, res) {
  rr.get(`URL:${req.params.guest_session_id}`).then(result => {
    if (result == 1) {
      rr.get(req.params.guest_session_id).then(result => {
        let useFile = getCorrectFileName(req.originalUrl);
        if(req.session.userToken){
          request.get({
              url: 'https://webexapis.com/v1/people/me',
              headers: { 'Authorization': `Bearer ${req.session.userToken}` }
            },function(error, resp, body) {
                console.log(body);
                if (!error && resp.statusCode === 200) {
                  selfBody = JSON.parse(body);
                  redisStore = JSON.parse(result);
                  res = setRenderedCookies(req.params.guest_session_id, res, "licensed", redisStore, req.session.userToken, selfBody.displayName);
                  res.sendFile(__dirname + `/public/${useFiles[useFile]}.html`);
                } else {
                  res.json(error);
                }
              }
            );
        } else {
          res.redirect(`${AUTH_URL}&state=${useFile}/${req.params.guest_session_id}`);
        }
      });
    } else {
      res.send({ message: `this link has expired` });
    }
  });
}

router.get(`/widget`, quickRenderFunc);
router.get(`/guest`, quickRenderFunc);
router.get(`/guest-widget`, quickRenderFunc);
router.get(`/widget/:guest_session_id`, renderFunc);
router.get(`/guest/:guest_session_id`, renderFunc);
router.get(`/guest-widget/:guest_session_id`, renderFunc);

router.get(`/licensed`, quickRenderFunc);
router.get(`/licensed-widget`, quickRenderFunc);
router.get(`/licensed-sms`, quickRenderFunc);
router.get(`/licensed/:guest_session_id`, renderLicensedFunc);
router.get(`/licensed-widget/:guest_session_id`, renderLicensedFunc);
router.get(`/licensed-sms/:guest_session_id`, renderLicensedFunc);

/*router.use(`/widget`, express.static(__dirname + '/public'));
router.use(`/guest`, express.static(__dirname + '/public'));
router.use(`/guest-widget`, express.static(__dirname + '/public'));

router.use(`/licensed`, express.static(__dirname + '/public'));
router.use(`/licensed-widget`, express.static(__dirname + '/public'));
router.use(`/licensed-sms`, express.static(__dirname + '/public'));*/

router.use(`/hidden/:guest_session_id`, function(req, res, next){
  req.session.codeComplete = true;
  next();
});
router.get(`/hidden/:guest_session_id`, renderFunc);


function isRoomId(myTarget){
  let result = base64url.decode(myTarget);
  return result.indexOf('ciscospark://') >= 0 && result.indexOf('ROOM') >= 0;
}

router.get(`/create_token`, function(req, res, next) {
  let redirectURI = `https://${req.get("host")}${process.env.MY_ROUTE}${req.route.path}`;
  console.log(`/create_token redirectURI: ${redirectURI}`);
  let myForm = {
    grant_type: 'authorization_code',
    client_id: process.env.WEBEX_AUTH_CLIENT,
    client_secret: process.env.WEBEX_AUTH_SECRET,
    code: req.query.code,
    redirect_uri: redirectURI
  };
  //console.log(myForm);
  request.post({
      url: 'https://webexapis.com/v1/access_token',
      form: myForm
    },function(error, resp, body) {
      //console.log('/access_token response body:');
      //console.log(body);
      if (!error && resp.statusCode === 200) {
        jbody = JSON.parse(body);
        console.log(`/create_token state: ${req.query.state}`);
        req.session.userToken = jbody.access_token;
        request.get({
            url: 'https://webexapis.com/v1/people/me',
            headers: { 'Authorization': `Bearer ${req.session.userToken}` }
          },function(error, resp, body) {
            console.log(body);
              if (!error && resp.statusCode === 200) {
                jbody = JSON.parse(body);
                //req.session.avatar = jbody.avatar;
                req.session.save();
                res.cookie('avatar', jbody.avatar);
                //redirect(res, `/${req.query.state}`);
                res.redirect(`/${req.query.state}`);
              } else {
                res.json(error);
              }
            }
          );
      } else {
        console.log('/access_token Error:');
        console.log(error);
        console.log("resp:");
        console.log(resp);
        console.log("**********");
        res.json(error);
      }
      }
    );
});

function embedLink(userType, body){
  /*{
    sip_target: 'https://wxsd.webex.com/meet/rtaylorhanson',
    destination_type: 'sip' // I think this only applies to widget, unused in this embedLink
  }*/
  //TODO: In guest.js, look at userType.  if token undefined and userType is guest, ask server to generate a JWT
  //      If userType is licensed and token is undefined OR invalid, alert with invalid token message
  //      These should both only happen if a urlparam was used, not a cookie.
  console.log('embedLink:');
  console.log(body);
  let destination = encodeURIComponent(body.sip_target);
  let url = `${process.env.EMBED_URL}?destination=${destination}&userType=${userType}&headerToggle=${body.header_toggle}`;
  if(userType == "licensed"){
    url += `&token={TOKEN}`;
  } else if(userType == "guest"){
    url += `&token={JWT}`;
  }
  let useBackgroundImg = process.env.DEFAULT_BACKGROUND_IMG;
  if(body.background_url != ''){
    useBackgroundImg = body.background_url;
  } 
  url += `&backgroundImage=${encodeURIComponent(useBackgroundImg)}`;
  if([null, undefined, ''].indexOf(body.share_only_option) < 0){
    url +=`&shareOnlyOption=${body.share_only_option}`;
  }
  url += `&listenOnlyOption=${body.listen_only_option}&selfView=${body.self_view}&showSMS=${body.sms_button}&autoDial=${body.auto_dial}`;
  if([null, undefined, ''].indexOf(body.meet_button_color) < 0){
    let meetButtonColor = body.meet_button_color.replace("#","");
    url +=`&meetButtonColor=${meetButtonColor}`;
  }
  return url;
}

function generateLinks(req, res, expire_seconds, destinationType){
  if(parseFloat(req.body.version) == 2){
    generateLinksV2(req, res, expire_seconds, destinationType)
  } else {
    generateLinksV1(req, res, expire_seconds, destinationType)
  }
}

function generateLinksV2(req, res, expire_seconds, destinationType){
  let urlPaths = {"guest":["guest", "guest-widget"], "licensed": ["licensed", "licensed-widget"]};
  let respObjects = {};
  let guestSessionID = randomize("Aa0", 16);

  req.body.destination_type = destinationType
  let rrPromise = rr.setURL(guestSessionID, JSON.stringify(req.body), expire_seconds)
    .then(() => {
      for(let urlUserType in urlPaths){
        let objName = urlUserType.charAt(0).toUpperCase() + urlUserType.slice(1);//capitalize first letter
        respObjects[objName] = [];
        for(let urlViewType in urlPaths[urlUserType]){
          respObjects[objName].push(`${process.env.BASE_URL}/${urlPaths[urlUserType][urlViewType]}/${guestSessionID}`);
        }
        respObjects[objName].push(embedLink(urlUserType, req.body));
      }
      console.log(respObjects);
      res.send({
        result: "OK",
        message: "Session Created",
        urls: respObjects,
        expires: `in ${thismoment.duration(expire_seconds, "seconds").humanize()}`,
        expires_at: new Date(new Date().getTime() + expire_seconds*1000).toUTCString()
      });
    })
    .catch(function(err) {
      console.log('generateLinksV2 err.message:');
      console.log(err.message);
    });
}

function generateLinksV1(req, res, expire_seconds, destinationType){
  let urlPaths = {"guest":["guest", "widget"], "licensed": ["licensed", "licensed-widget", "licensed-sms"]};
  let respObjects = {};
  let rrPromises = [];
  let guestSessionID = randomize("Aa0", 16);

  req.body.destination_type = destinationType
  let rrPromise = rr.setURL(guestSessionID, JSON.stringify(req.body), expire_seconds)
    .then(() => {
      for(let i in urlPaths){
        let objName = i.charAt(0).toUpperCase() + i.slice(1);//capitalize first letter
        respObjects[objName] = [];
        for(let j in urlPaths[i]){
          respObjects[objName].push(`${process.env.BASE_URL}/${urlPaths[i][j]}/${guestSessionID}`);
        }
      }
      console.log(respObjects);
      res.send({
        result: "OK",
        message: "Session Created",
        urls: respObjects,
        expires: `in ${thismoment.duration(expire_seconds, "seconds").humanize()}`
      });
    })
    .catch(function(err) {
      console.log(err.message);
    });
}

function sendInvalidSipError(res){
  res.status(400);
  res.send({
    result: "Error",
    message: "Invalid SIP URI or RoomId!"
  });
}

function sendMissingExpiryError(res){
  res.status(400);
  res.send({
    result: "Error",
    message: "Missing required parameter 'expire_hours', 'expire_timestamp' or 'expiry_date'."
  });
}

function sendExpiryError(res){
  res.status(400);
  res.send({
    result: "Error",
    message: "Expire time must be great than 0."
  });
}


router.post(`/create_url`, function(req, res) {
  if (req.body.expire_hours || req.body.expire_timestamp || req.body.expiry_date) {
    if(req.body.skip_validation || email_validator.validate(req.body.sip_target) || isRoomId(req.body.sip_target) || ["pmr", "ad_hoc"].indexOf(req.body.sip_target) >= 0){
      let expire_seconds = req.body.expire_hours * 60 * 60 //convert hours to seconds;
      if(req.body.expire_timestamp){
        expire_seconds = req.body.expire_timestamp - new Date().getTime()/1000;
      } else if(req.body.expiry_date){
        expire_seconds = Math.round(
          expiry.calculateSeconds(
            thismoment().utcOffset(req.body.offset * -1),
            req.body.expiry_date
          )
        );
      }
      console.log('/create_url:');
      console.log(req.body);
      console.log(`expire_seconds: ${expire_seconds}`);
      if(expire_seconds > 0){
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
                  generateLinks(req, res, expire_seconds, destinationType);
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
                        //"allowFirstUserToBeCoHost":true //Error: {"message":"The request could not be understood by the server due to malformed syntax. See 'errors' for more details.","errors":[{"description":"You can not turn on 'allowAnyUserToBeCoHost' and 'allowFirstUserToBeCoHost' at the same time."}],"trackingId":"ROUTER_62A895B5-BFF4-01BB-259A-AC12DB4A259A"}
                        "enableAutomaticLock":false,
                        "enableConnectAudioBeforeHost":true,
                        "enabledAutoRecordMeeting":false,
                        "enabledJoinBeforeHost":true,
                        //"publicMeeting":true, //Error: {"message":"The input parameters contain invalid item","errors":[{"description":"Cannot schedule public meeting. All meetings must be unlisted option is enabled by site admin"}],"trackingId":"ROUTER_62A89442-3328-01BB-14C8-AC12DF8A14C8"}
                        "sendEmail":false,
                        "unlockedMeetingJoinSecurity":"allowJoin",
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
                  generateLinks(req, res, expire_seconds, destinationType);
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
                  generateLinks(req, res, expire_seconds, destinationType);
                }
              );
          } else {
            generateLinks(req, res, expire_seconds, destinationType);
          }
        }
      } else {
        sendExpiryError(res);
      }
    } else {
      sendInvalidSipError(res);
    }
  } else {
    sendMissingExpiryError(res);
  }
});

function sendCreateCard(destination){
  let rawCard = fs.readFileSync(__dirname +'/cards/create.json');
  let card = JSON.parse(rawCard);
  sendCard(card, destination);
}

function updateLinksCard(card, demoType, subType, url){
  let title = demoType + " " + subType;
  card.body[3].items.push({
    "type": "ColumnSet",
    "spacing":"None",
    "columns": [
        {
            "type": "Column",
            "width": "auto",
            "items": [
                {
                    "type": "Input.Toggle",
                    "id": `toggle_${demoType}_${subType}`,
                    "value": "false",
                    "spacing": "None",
                    "title": " "
                }
            ],
            "verticalContentAlignment": "Center"
        },
        {
            "type": "Column",
            "width": "stretch",
            "items": [
                {
                    "type": "TextBlock",
                    "text": `[${title}](${url})`,
                    "wrap": true
                }
            ],
            "verticalContentAlignment": "Center"
        }
    ]
  },
  {
    "type": "Input.Text",
    "id":`url_${demoType}_${subType}`,
    "value": url,
    "spacing":"None",
    "isVisible": false
  });
}

function sendLinksCardV2(destination, target, urls, expires_msg, link_type){
  console.log("sendLinksCardV2")
  console.log(link_type);
  let rawCard = fs.readFileSync(__dirname +'/cards/links_multi.json');
  let card = JSON.parse(rawCard);
  card.body[1].columns[1].items[0].text = target;
  card.body[2].columns[1].items[0].text = expires_msg;
  let cellTitles = ["SDK", "Widget", "Embeddable"];
  let useIndex = -1;
  if(link_type != "all"){
    useIndex = cellTitles.indexOf(link_type);
  }
  card.body[3].items = [];
  for(let demoType in urls){
    if(useIndex >= 0){
      updateLinksCard(card, demoType, cellTitles[useIndex], urls[demoType][useIndex]);
    } else {
      for(let url_index in urls[demoType]){
        updateLinksCard(card, demoType, cellTitles[url_index], urls[demoType][url_index]);
      }
    }
  }
  console.log(JSON.stringify(card));
  sendCard(card, destination);
}

function sendLinksCardV1(destination, target, urls, expires_msg){
  let rawCard = fs.readFileSync(__dirname +'/cards/links.json');
  let card = JSON.parse(rawCard);
  card.body[1].columns[1].items[0].text = target;
  card.body[2].columns[1].items[0].text = expires_msg;
  let cellTitles = ["SDK", "Widget"];
  for(let demoType in urls){
    for(let url_index in urls[demoType]){
      let title = demoType + " " + cellTitles[url_index]
      let url = urls[demoType][url_index];
      card.body[3].choices.push({
        "title": `[${title}](${url})`,
        "value": url
      })
    }
  }
  console.log(JSON.stringify(card));
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
        let newData = {}
        newData.sip_target = result.inputs.destination;
        newData.expire_hours = parseInt(result.inputs.expires_in ,10);//getExpireDate(expire_hours);
        newData.offset = 0;
        let deleteKeys = ["destination", "expires_in", "submit"];
        for(let dkey of deleteKeys){
          delete result.inputs[dkey];
        }
        newData = {...newData, ...result.inputs};
        request.post({
              url: `http://localhost:${process.env.PORT}/create_url`,
              headers: {'content-type' : 'application/json'},
              body:    JSON.stringify(newData)
          }, function(error, response, createResult){
            console.log(createResult);
            jresult = JSON.parse(createResult);
            if(jresult.result == "Error"){
              webex.messages.create({"roomId":req.body.data.roomId, "markdown":jresult.message});
            } else {
              if(parseInt(newData.version) == 2){
                sendLinksCardV2(req.body.data.roomId, newData.sip_target, jresult.urls, jresult.expires, newData.link_type);
              } else {
                sendLinksCardV1(req.body.data.roomId, newData.sip_target, jresult.urls, jresult.expires);
              }
              
            }
          }
        )
      } else if(["show_links", "sms_links", "email_links", "links"].indexOf(result.inputs.submit) >=0){//"links" is deprecated
        let message = "";
        let demoTypes = ["Guest", "Licensed"];
        let subTypes = ["SDK", "Widget", "Embeddable"];
        let urls = [];
        for(let demoType of demoTypes){
          for(let subType of subTypes){
            let keyName = `${demoType}_${subType}`;
            if(result.inputs.hasOwnProperty(`toggle_${keyName}`) && result.inputs[`toggle_${keyName}`] == "true"){
              let urlVal = result.inputs[`url_${keyName}`];
              urls.push([keyName, urlVal]);
            }
          }
        }
        console.log(urls);
        if(urls.length == 0){
          message = "You must select one or more of the url choices in the card."
          webex.messages.create({"roomId":req.body.data.roomId, "markdown":message});
        } else {
          if(result.inputs.submit != "show_links"){
            for(let url of urls){
              let newData = {}
              let urlPath = "sms";
              if(result.inputs.submit == "email_links"){
                newData.to = result.inputs.email;
                newData.destination = result.inputs.email;
                urlPath = "email";
              } else {
                newData.number = result.inputs.phone;
                newData.destination = result.inputs.phone;
              }
              newData.url = url[1];
              request.post({
                  url: `http://localhost:${process.env.PORT}/${urlPath}`,
                  headers: {'content-type' : 'application/json'},
                  body: JSON.stringify(newData)
                }, function(error, response, body){
                  console.log(body);
                  jresult = JSON.parse(body);
                  if(jresult.status == "failure"){
                    message = jresult.message;
                  } else {
                    message = `Success - [Link](${newData.url}) sent to ${newData.destination} (be sure to check your spam)!`;
                  }
                  webex.messages.create({"roomId":req.body.data.roomId, "markdown":message});
                }
              )
            }
          } else if(result.inputs.submit == "show_links"){
            for(let url of urls){
              let name = url[0].replace("_"," ");
              message += `${name}:  \n`;
              message += url[1] + "\n\n";
            }
            webex.messages.create({"roomId":req.body.data.roomId, "markdown":message});
          }
        }
      }
    })
    res.send('OK');
  }
});


async function sendEmail(_to, subject, body, res) {
    var document = {
      "alertType":"wxpdemoEmail",
      "alertDestinations": [ _to ],
      "alertBody": {
          "Html": {
              "Data": body
          }
      },
      "alertMeta": "metadata",
      "alertParams": {
        "subject":subject,
        "parameterValue":"value"
      }
    }

    // Create the HTTP request
    var request = new HttpRequest({
        body: JSON.stringify(document),
        headers: {
            'Content-Type': 'application/json',
            'host': 'alerts.wbx.ninja'
        },
        hostname: 'alerts.wbx.ninja',
        method: 'POST',
        path: '/alerts'
    });
        
    // Sign the request
    var signer = new SignatureV4({
        credentials: defaultProvider(),
        region: 'us-east-1',
        service: 'execute-api',
        sha256: Sha256
    });
    
    var signedRequest = await signer.sign(request);

    // Send the request
    var client = new NodeHttpHandler();
    var { response } =  await client.handle(signedRequest)
    console.log(response.statusCode + ' ' + response.body.statusMessage);
    var responseBody = '';
    await new Promise(() => {
      response.body.on('data', (chunk) => {
        responseBody += chunk;
      });
      response.body.on('end', () => {
        console.log('Success, Response body: ' + responseBody);
        res.send({"status":"success", "message":'Success! (check spam)'});
      });
    }).catch((error) => {
        console.log('Error: ' + error);
        res.send({"status":"failure", "message":'An error occurred sending the email.'});
    });
}

/*
function sendEmailMailGun(_to, subject, body, res){
  const mg = mailgun({apiKey: 'key-', domain: 'example.com'});
  const data = {
    from: 'WXSD <wxsd@example.org>',
    to: _to,
    subject: subject,
    text: body
  };
  mg.messages().send(data, function (error, body) {
    console.log(body);
    res.send({"status":"success", "message":'Success! (check spam)'});
  });
}*/

/*
function sendEmailOld(_to, subject, body, res){
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
        clientId: process.env.EMAIL_OAUTH_CLIENTID,
        clientSecret: process.env.EMAIL_OAUTH_CLIENTSECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN
    }
  });

  let message = {
    from: process.env.EMAIL_USERNAME,
    to: _to,
    subject: subject,
    html: body
  }

  transporter.sendMail(message, function(err, info) {
    if (err) {
      console.log(err);
      res.send({"status":"failure", "message":'An error occurred sending the email.'});
    } else {
      console.log(info);
      res.send({"status":"success", "message":'Success! (check spam)'});
    }
  });
}*/

router.post(`/email`, function(req, res, next){
  console.log('/email');
  if(validateEmail(req.body.to) == false){
    res.send({"status":"failure", "message":'Email address entered is not valid.'});
  } else {
    let body = null;
    if(req.body.message){
      body = req.body.message;
    } else {
      body = "Your Meeting Join Link:  \n" + req.body.url;
    }
    let subject = "Your Meeting Join Link";
    if(req.body.subject){
      subject = req.body.subject;
    }
    sendEmail(req.body.to, subject, body, res);
  }
})


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

  let number = validatePhoneNumber(req.body.number);
  if(number === false){
    message = "Phone number entered is not valid."
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

app.use(`/`, router);
app.use(`${process.env.MY_ROUTE}`, function(req, res, next){
  console.log('use route:')
  console.log(req.url);
  next();
}, router);
// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

RedisExpiredEvents();
