//const sendemail = require('mailgun-js');

const mailgun = require('mailgun-js')({apiKey: process.env.MG_API_KEY, domain: process.env.DOMAIN});


module.exports = function (to, from, subject, body){
  
  console.log (data);
  
  var data = {
    from: from,
    to: to,
    subject: subject,
    text: body
  };

  mailgun.messages().send(data, function (error, result) {
    console.log(result);
  });
  
};

