// server.js
// where your node app starts
require('dotenv').config();
// init project
const express = require("express");
const bodyParser = require("body-parser");
const RedisExpiredEvents = require("./redis-expired-events");
const expiry = require("./expiry");
const app = express();
const thismoment = require("moment");
const url = require("url");
const randomize = require("randomatic");
const session = require("express-session");
const RedisRepo = require("./redis-repo");
const rr = new RedisRepo();
const tokgen = require("./token-generator");
const email_validator = require("email-validator");
//sentry.io
const Sentry = require("@sentry/node");
Sentry.init({
  dsn:
    "https://f453e51294d34cdb9a2962000f5612e3@o450029.ingest.sentry.io/5434024"
});
//const send_email = require('./sendemail');
const send_email = require("./sg-email");
// http://expressjs.com/en/starter/static-files.html

// config express-session
var sess = {
  secret: "CHANGE THIS TO A RANDOM SECRET",
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get("env") === "production") {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;
  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  app.set("trust proxy", 1);
}

app.use(session(sess));

// Load Passport
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/callback"
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());
// You can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.engine('pug', require('pug').__express)
app.set("view engine", "pug");

var userInViews = require("./lib/middleware/userInViews");
var authRouter = require("./routes/auth");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const linkgenRouter = require("./routes/linkgen");

// ..
app.use(userInViews());
app.use("/", authRouter);
app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/", linkgenRouter);
// ..
app.use(express.static("public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

/*
// http://expressjs.com/en/starter/basic-routing.html
app.get('/link', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
*/

app.get("/widget/:guest_session_id", function(request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  //console.log("got a hit")
  //response.send({ message: `if not expired, this is where the widget will load for session ${request.params.guest_session_id}`});
  rr.get(`URL:${request.params.guest_session_id}`).then(result => {
    console.log(result);
    if (result == 1) {
      rr.get(request.params.guest_session_id).then(result => {
        //response.send({message: `${result}`});
        //response.json(JSON.parse(result));
        response.cookie("token", tokgen(JSON.parse(result).display_name).token);
        response.cookie("target", JSON.parse(result).sip_target);
        response.cookie("label", JSON.parse(result).display_name);
        //response.send(JSON.stringify(request.body));
        response.sendFile(__dirname + "/views/widget.html");
      });
    } else {
      response.send({ message: `this link has expired` });
    }
  });
});

app.get("/guestsdk/:guest_session_id", function(request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  //console.log("got a hit")
  //response.send({ message: `if not expired, this is where the widget will load for session ${request.params.guest_session_id}`});
  rr.get(`URL:${request.params.guest_session_id}`).then(result => {
    console.log(result);
    if (result == 1) {
      rr.get(request.params.guest_session_id).then(result => {
        //response.send({message: `${result}`});
        //response.json(JSON.parse(result));
        response.cookie("token", tokgen(JSON.parse(result).display_name).token);
        response.cookie("target", JSON.parse(result).sip_target);
        response.cookie("label", JSON.parse(result).display_name);
        //response.send(JSON.stringify(request.body));
        response.sendFile(__dirname + "/views/sdk.html");
      });
    } else {
      response.send({ message: `this link has expired` });
    }
  });
});

app.get("/guest/:guest_session_id", function(request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  //console.log("got a hit")
  //response.send({ message: `if not expired, this is where the widget will load for session ${request.params.guest_session_id}`});
  rr.get(`URL:${request.params.guest_session_id}`).then(result => {
    console.log(result);
    if (result == 1) {
      rr.get(request.params.guest_session_id).then(result => {
        //response.send({message: `${result}`});
        //response.json(JSON.parse(result));
        response.cookie("token", tokgen(JSON.parse(result).display_name).token);
        response.cookie("target", JSON.parse(result).sip_target);
        response.cookie("label", JSON.parse(result).display_name);
        //response.send(JSON.stringify(request.body));
        response.sendFile(__dirname + "/views/guest.html");
      });
    } else {
      response.send({ message: `this link has expired` });
    }
  });
});

app.get("/employee/:guest_session_id", function(request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  //console.log("got a hit")
  //response.send({ message: `if not expired, this is where the widget will load for session ${request.params.guest_session_id}`});
  rr.get(`URL:${request.params.guest_session_id}`).then(result => {
    console.log(result);
    if (result == 1) {
      rr.get(request.params.guest_session_id).then(result => {
        //response.send({message: `${result}`});
        //response.json(JSON.parse(result));
        response.cookie("token", tokgen(JSON.parse(result).display_name).token);
        response.cookie("target", JSON.parse(result).sip_target);
        response.cookie("label", JSON.parse(result).display_name);
        //response.send(JSON.stringify(request.body));
        response.sendFile(__dirname + "/views/employee.html");
      });
    } else {
      response.send({ message: `this link has expired` });
    }
  });
});

// http://expressjs.com/en/starter/basic-routing.html
app.post("/create_url", function(request, response) {
  if (
    email_validator.validate(request.body.sip_target) &&
    request.body.expiry_date
  ) {
    console.log(
      thismoment(request.body.expiry_date).utcOffset(request.body.offset)
    );
    let endmoment = thismoment(request.body.expiry_date).utcOffset(
      request.body.offset
    );

    let Urlexpiry = Math.round(
      expiry.calculateSeconds(
        thismoment().utcOffset(request.body.offset, true),
        request.body.expiry_date
      )
    );
    //let Urlexpiry = Math.round(expiry.calculateSeconds(thismoment(),request.body.expiry_date));
    let guestSessionID = randomize("Aa0", 16);
    //let guestUrl = `${request.protocol}://${request.get('host')}/widget/${guestSessionID}`;
    let urlPath = "guest";
    if(request.body.display_name == "Employee") urlPath = "employee";
    let guestUrl = `https://${request.get(
      "host"
    )}/${urlPath}/${guestSessionID}`;
    request.body.url = guestUrl;
    //console.log(`full url - ${guestUrl}`);
    rr.setURL(guestSessionID, JSON.stringify(request.body), Urlexpiry)
      .then(() => console.log(request.body))
      .then(() =>
        response.send({
          result: "OK",
          message: "Session Created",
          url: `${guestUrl}`,
          expires: `in ${thismoment.duration(Urlexpiry, "seconds").humanize()}`
        })
      )
      .catch(function(err) {
        console.log(err.message);
      });

    //.then((message) => validate_message_object(message))
    //response.send({ result: 'OK', message: 'Session Created', url: `${guestUrl}`, expires: `in ${thismoment.duration(Urlexpiry, "seconds").humanize()}` });
  } else {
    response.send({
      result: "Error",
      message: "Invalid SIP URI or Expiry provided!"
    });
  }
});

app.post("/email_invite", function(request, response) {
  console.log(request.body);
  //send_email('harishchawla@hotmail.com','this is some body');
  send_email(
    request.body.send_to_email,
    `Use this link to join the show ${request.body.url}. Remember, it expires ${request.body.expires}`
  )
    .then(() => {
      response.send({ message: `Email sent!` });
    })
    .catch(e => {
      Sentry.captureException(e);
    });
});

app.post("/sms_invite", function(request, resposne) {});

app.get("/sdk", function(req, res) {
  res.sendFile(__dirname + "/views/sdk.html");
});

app.get("/theo", function(req, res) {
  res.sendFile(__dirname + "/views/theo.html");
});

app.get("/theofs", function(req, res) {
  res.sendFile(__dirname + "/views/theofs.html");
});

app.get("/sdkmm", function(req, res) {
  res.sendFile(__dirname + "/views/sdk-mm.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

RedisExpiredEvents();
//YYYYMMDD
//console.log(expiry.calculateDays(thismoment(),'20190714'));
//console.log(expiry.calculateSeconds(thismoment(),'20200714'));

//rr.setURL('98r34982r', '325325', 500);
//console.log(tokgen("Harish Chawla").token);

//console.log(thismoment());
//console.log(thismoment('2019-07-16 00:54').utcOffset(240));

//send_email('zoneix@gmail.com', 'admin@bigbrainpan.com', 'this is a test', 'here\'s the body');
//send_email('harishchawla@hotmail.com','this is some body');
//console.log((send_email).toString());
