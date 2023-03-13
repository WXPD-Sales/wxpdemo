function phoneValidate(number){
  return true;
  //Removed phone validation until we can iron out the countries we can support.
  //May be best to just forgo this and only validate on backend anyway (see /sms in server.js)
  /*
  if(number.trim().match(/^((\+1)?[\s-]?)?\(?[1-9]\d\d\)?[\s-]?[1-9]\d\d[\s-]?\d\d\d\d/) == null) {
      return false;
  }*/
}

function emailValidate(email){
  return true;
  /*let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);*/
}

function overlayOn(){
  document.getElementById("overlay").style.display = "block";
}

function hideEmailOverlay(){
  $('#email-input').hide();
  $('#send-email').hide();
}

function hideSMSOverlay(){
  $('#sms-input').hide();
  $('#send-sms').hide();
}

$("#overlay").on('click', function(e){
  console.log(e);
  if(e.target.id=="overlay"){
    $("#overlay").hide();
    $("#error-input").hide();
    $("#spinner").hide();
    hideEmailOverlay();
    hideSMSOverlay();
  }
});

function emailFunction(link){
  $('#send-input-description').text('Enter an email address to send link');
  $('#email-input').show();
  $('#send-email').show();
  selectedLink = link;
  overlayOn();
}

function smsFunction(link){
  $('#send-input-description').text('Enter a mobile number to send link');
  $('#sms-input').show();
  $('#send-sms').show();
  selectedLink = link;
  overlayOn();
}

function updateErrorElement(msg){
  let errEle = document.getElementById("error-input");
  errEle.innerHTML = msg;
  errEle.style.display = "inline";
  errEle.style.color = "red";
}

function updateMessageElement(msg){
  let msgEle = document.getElementById("error-input");
  msgEle.innerHTML = msg;
  msgEle.style.display = "inline";
  msgEle.style.color = "green";
}

async function sendSMS(){
  let number = document.getElementById("sms-input").value;
  console.log(number);
  if(phoneValidate(number) == false){
      updateErrorElement("Please enter a valid phone number");
  } else {
    disableSMSButton();
    $("#error-input").hide();
    fetch('/sms', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({number:number, url:selectedLink}),
    })
    .then(response => response.json())
    .then(function(data){
      console.log(data);
      console.log(data.status);
      if(data.status == "success"){
        updateMessageElement("Success! (check spam)");
      } else {
        updateErrorElement(data.message);
      }
      enableSMSButton();
    })
    .catch(function(err) {
      console.log(err);
    });
  }
}

$("#sms-input").keypress(function(e){
  var key = e.which;
  if(key ==13){
    $(`#send-sms`).click();
    return false;
  }
});

function disableSMSButton(){
  $("#send-sms").hide();
  $("#spinner").show();
}

function enableSMSButton(){
  $("#send-sms").show();
  $("#spinner").hide();
}

async function sendEmail(){
  console.log('send email pressed');
  let email = document.getElementById("email-input").value;
  console.log(email);
  if(emailValidate(email) == false){
      updateErrorElement("Please enter a valid email address");
  } else {
      disableEmailButton();
      $("#error-input").hide();
      let data = {to:email, url:selectedLink};
      console.log(data);
      fetch('/email', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(function(data){
          console.log(data);
          console.log(data.status);
          if(data.status == "success"){
            updateMessageElement("Success! (check spam)");
          } else {
            updateErrorElement(data.message);
          }
          enableEmailButton();
      })
      .catch(function(err) {
          console.log(err);
      });
  }
}

$("#email-input").keypress(function(e){
  var key = e.which;
  if(key ==13){
    $(`#send-email`).click();
    return false;
  }
});

function disableEmailButton(){
  $("#send-email").hide();
  $("#spinner").show();
}

function enableEmailButton(){
  $("#send-email").show();
  $("#spinner").hide();
}