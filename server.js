// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const RedisExpiredEvents = require('./redis-expired-events');
const expiry = require('./expiry');
const app = express();
const thismoment = require('moment');
const url = require('url');
const randomize = require('randomatic');

const RedisRepo = require('./redis-repo');
const rr = new RedisRepo;

const tokgen = require('./token-generator');
const email_validator = require("email-validator");
const send_email = require('./sendemail');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/guest/:guest_session_id', function(request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  //console.log("got a hit")
  //response.send({ message: `if not expired, this is where the widget will load for session ${request.params.guest_session_id}`});
  rr.get(`URL:${request.params.guest_session_id}`)
  .then((result)=>{
    console.log(result);
    if (result == 1){
      rr.get(request.params.guest_session_id)
      .then((result)=>{
        //response.send({message: `${result}`});
        //response.json(JSON.parse(result));
        response.cookie("token",tokgen(JSON.parse(result).display_name).token);
        response.cookie("target",JSON.parse(result).sip_target);
        response.cookie("label",JSON.parse(result).display_name);
        //response.send(JSON.stringify(request.body));
        response.sendFile(__dirname + '/views/widget.html');
      });
      
      //----
      /*
        response.cookie("token",tokgen(result.display_name).token);
        response.cookie("target",result.sip_target);
        response.cookie("label",result.display_name);
        //response.send(JSON.stringify(request.body));
        response.sendFile(__dirname + '/views/widget.html');
       */
      //----
    } else {
      response.send({message: `this link has expired`});
    }
  });

});

// http://expressjs.com/en/starter/basic-routing.html
app.post('/create_url', function(request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  
  if (email_validator.validate(request.body.sip_target) && request.body.expiry_date){
    console.log(thismoment(request.body.expiry_date).utcOffset(request.body.offset));
    let endmoment = thismoment(request.body.expiry_date).utcOffset(request.body.offset);
    //console.log("teh end "+thismoment(endmoment));
    let Urlexpiry = Math.round(expiry.calculateSeconds(thismoment().utcOffset(request.body.offset, true),request.body.expiry_date));
    //let Urlexpiry = Math.round(expiry.calculateSeconds(thismoment(),request.body.expiry_date));
    let guestSessionID = randomize('Aa0', 16);
    //let guestUrl = `${request.protocol}://${request.get('host')}/guest/${guestSessionID}`;
    let guestUrl = `https://${request.get('host')}/guest/${guestSessionID}`;
    request.body.url = guestUrl;
    //console.log(`full url - ${guestUrl}`);
    rr.setURL(guestSessionID, JSON.stringify(request.body), Urlexpiry)
    .then(() => console.log(request.body))
    .then(() => response.send({ result: 'OK', message: 'Session Created', url: `${guestUrl}`, expires: `in ${thismoment.duration(Urlexpiry, "seconds").humanize()}` }))
    .catch(function(err) {
      console.log(err.message);
    });
    
    //.then((message) => validate_message_object(message))
    //response.send({ result: 'OK', message: 'Session Created', url: `${guestUrl}`, expires: `in ${thismoment.duration(Urlexpiry, "seconds").humanize()}` });
  }else{
    response.send({ result: 'Error', message: 'Invalid SIP URI or Expiry provided!'});
  };

});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
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

//console.log((send_email).toString());