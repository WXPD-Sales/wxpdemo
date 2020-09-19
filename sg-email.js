const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_SEND_KEY);

module.exports = async function (to, body){
  
  const msg = {
    //to: 'harishchawla@hotmail.com',
    to: to,
    from: process.env.SG_FROM,
    subject: 'Welcome to the show!',
    text: `${body}`,
    //html: `<h4>${process.env.SG_DISCLAIMER}</h4>`,
  };
  
  sgMail.send(msg).then((r)=> {
    console.log(r);
    return r;
  }).catch((e)=>{
    console.log(e);
    return e});
  
};

