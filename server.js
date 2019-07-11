// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const RedisExpiredEvents = require('./redis-expired-events');
const expiry = require('./expiry');
const app = express();
const thismoment = require('moment');
var url  = require('url');
const randomize = require('randomatic');

const RedisRepo = require('./redis-repo');
const rr = new RedisRepo;

const email_validator = require("email-validator");

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
  console.log("got a hit")
  response.send({ message: `if not expired, this is where the widget will load for session ${request.params.guest_session_id}`});
});

// http://expressjs.com/en/starter/basic-routing.html
app.post('/create_url', function(request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  console.log(request.body);
  //console.log(expiry.calculateDays(thismoment(),request.body.expiry_date));
  let Urlexpiry = Math.round(expiry.calculateSeconds(thismoment(),request.body.expiry_date));
  let guestSessionID = randomize('Aa0', 16);
  let guestUrl = `${request.protocol}://${request.get('host')}/guest/${guestSessionID}`;
  console.log(`full url - ${guestUrl}`);
  response.send({ result: 'OK', message: 'Session Created', url: `${guestUrl}`, expires: `in ${Urlexpiry} secs` });
  
  EmailValidator.validate("test@email.com");

});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

RedisExpiredEvents();
//YYYYMMDD
//console.log(expiry.calculateDays(thismoment(),'20190714'));
//console.log(expiry.calculateSeconds(thismoment(),'20200714'));

rr.setURL('98r34982r', '325325', 500);

function validate_guest_data(target_url){
  
  
}

function create_guest_record(){
  
}