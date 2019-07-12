const sendemail = require('mailgun-js');

const mg = sendemail({apiKey: process.env.MG_API_KEY, domain: process.env.DOMAIN});


module.exports = function (to, from, subject, body){
  console.log ("got this - " + to, from, subject, body);
  console.log ("got data - "+ JSON.stringify(data));
  
  let payload = {};
  payload.from = from;
  payload.to = to;
  payload.subject = subject;
  payload.body = body;
  
  console.log ("payload - " + JSON.stringify(payload));
  var data = {
    from: from,
    to: to,
    subject: subject,
    text: body
  };

  mg.messages().send(data, function (error, body) {
    console.log("got result -" + body);
  });
  
};

/*
const mailgun = require("mailgun-js");
const DOMAIN = 'YOUR_DOMAIN_NAME';
const mg = mailgun({apiKey: api_key, domain: DOMAIN});
const data = {
	from: 'Excited User <me@samples.mailgun.org>',
	to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
	subject: 'Hello',
	text: 'Testing some Mailgun awesomness!'
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});

*/