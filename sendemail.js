//const sendemail = require('mailgun-js');

const mailgun = require('mailgun-js')({apiKey: process.env.MG_API_KEY, domain: process.env.DOMAIN});


module.exports = function (to, from, subject, body){
  console.log ("got this - " + to, from, subject, body);
  console.log ("got data - "+data);
  
  //let payload
  var data = {
    from: from,
    to: to,
    subject: subject,
    text: body
  };

  mailgun.messages().send(data, function (error, result) {
    console.log("got result -"+result);
  });
  
};

