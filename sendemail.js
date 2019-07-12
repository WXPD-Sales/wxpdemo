
var API_KEY = process.env.MG_API_KEY;
var DOMAIN = process.env.DOMAIN;
var mg = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN, host: 'api.mailgun.net'});

module.exports = function (to, from, subject, text){

  const data = {
    //from: process.env.MG_FROM,
    from: 'BBP Admin <admin@bigbrainpan.com>',
    to: 'harishchawla@hotmail.com',
    subject: 'Hello',
    text: 'Some message'
  };
  console.log(data);
  
  mg.messages().send(data, (error, body) => {
  console.log(body);
    
  mg.get('/samples.mailgun.org/stats', { event: ['sent', 'delivered'] }, function (error, body) {
    console.log(body);
  }); 
    
});
  
};

/*
var API_KEY = 'YOUR_API_KEY';
var DOMAIN = 'YOUR_DOMAIN_NAME';
var mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

const data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'foo@example.com, bar@example.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};

mailgun.messages().send(data, (error, body) => {
  console.log(body);
});

*/