function phoneValidate(number){
  if(number.trim().match(/^((\+1)?[\s-]?)?\(?[1-9]\d\d\)?[\s-]?[1-9]\d\d[\s-]?\d\d\d\d/) == null) {
      return false;
  }
}

let selectedLink = null;
let commandDeployPath = null;
function smsFunction(link, path){
  selectedLink = link;
  commandDeployPath = path;
  console.log(`commandDeployPath:${commandDeployPath}`)
  document.getElementById("error-number-input").style.display = "none";
  enableSMSButton();
  overlayOn();
}

async function sendSMS(){
  let number = document.getElementById("number-input").value;
  console.log(number);
  if(phoneValidate(number) == false){
      let errEle = document.getElementById("error-number-input");
      errEle.innerHTML = "Please enter a valid phone number"
      errEle.style.display = "inline";
  } else {
    disableSMSButton();
    $("#error-number-input").hide();
    fetch(commandDeployPath + '/sms', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({number:number, url:selectedLink}),
    })
    .then(response => response.json())
    .then(function(data){
      console.log(data);
      console.log(data.status);
      let msgEle = document.getElementById("error-number-input");
      if(data.status == "success"){
        //overlayOff();
        //overlayOff2();
        msgEle.style.color = "green";
        msgEle.innerHTML = "Success! (check spam)";
      } else {
        msgEle.style.color = "red";
        msgEle.innerHTML = data.message;
      }
      msgEle.style.display = "inline";
      enableSMSButton();
    })
    .catch(function(err) {
      console.log(err);
    });
  }
}

function pressEnter(e){
  var key = e.which;
  if(key ==13){
    $(`#send-sms`).click();
    return false;
  }
}

$("#number-input").keypress(pressEnter);

$("#overlay").on('click', function(e){
  if(e.target.id=="overlay"){
    $("#overlay").hide();
  }
});

function overlayOn(){
  document.getElementById("overlay").style.display = "block";
}

function disableSMSButton(){
  $("#send-sms").hide();
  $("#spinner").show();
}

function enableSMSButton(){
  $("#send-sms").show();
  $("#spinner").hide();
}

function overlayOff(){
  $("#overlay").hide();
}
