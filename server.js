// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const RedisExpiredEvents = require('./redis-expired-events');
const expiry = require('./expiry');
const app = express();
const thismoment = require('moment');

const randomize = require('randomatic');

const RedisRepo = require('./redis-repo');
const rr = new RedisRepo;

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

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

// http://expressjs.com/en/starter/basic-routing.html
app.post('/create_url', function(request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  console.log(request.body);
  console.log(expiry.calculateDays(thismoment(),request.body.expiry_date));
  response.send({ result: 'OK', message: 'Session updated' });
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