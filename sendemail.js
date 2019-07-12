
const mg = require('mailgun-js')({apiKey: process.env.MG_API_KEY, domain: process.env.DOMAIN});


module.exports = function (to, from, subject, text){

  const data = {
    from: process.env.MG_FROM,
    to: 'zoneix@gmail.com',
    subject: 'Hello',
    text: 'Some message'
  };

  mg.messages().send(data, function (error, body) {
    console.log("got result -" + body);
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