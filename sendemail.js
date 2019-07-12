const sendemail = require('mailgun-js');

var mailgun = require('mailgun-js')({apiKey: process.env.MG_API_KEY, domain: process.env.DOMAIN});


module.exports = function sendemail(to, from, subject, body){
  
  var data = {
    from: from,
    to: to,
    subject: subject,
    text: body
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
  });
}

