const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_SEND_KEY);

module.exports = function (to, body){
  
  const msg = {
    //to: 'harishchawla@hotmail.com',
    to: to,
    from: process.env.SG_FROM,
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  
sgMail.send(msg);
  
};

