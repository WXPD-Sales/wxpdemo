// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const RedisExpiredEvents = require('./redis-expired-events');
const expiry = require('./expiry');
const app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// http://expressjs.com/en/starter/basic-routing.html
app.post('/create_url', function(request, response) {
  //response.sendFile(__dirname + '/views/index.html');
  console.log(request.body);
  response.send({ result: 'OK', message: 'Session updated' });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

RedisExpiredEvents();
//YYYYMMDD
console.log(expiry.calculateDays('20180714','20190714'));
console.log(expiry.calculateSeconds('20180714','20190714'));

