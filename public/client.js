const offset = new Date().getTimezoneOffset();
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes();
let picked_date;
console.log(`time is ${time}`);

flatpickr("#flatpckr", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  minDate: "today",
  minTime: time,
  defaultTime: time,
  onChange: function(selectedDates, dateStr, instance) {
    console.log(`selection changed ${dateStr} `);
    picked_date = dateStr;
    document.getElementById('selected_expiry').innerHTML = picked_date;
  },
  allowInput: true,
  //time_24hr: true
});


let create_button = document.getElementById('create_button');
create_button.onclick = function (event){
  //event.preventDefault();
  try {
    create_guest_data_object()
    //.then((message) => validate_message_object(message))
    .then((result) => {
      console.log (result)
      if (result){
        post_data();
      } else {

      }
    });
  }
  catch (err){
    console.log(err);
  }

}
let guest_data = {};
//let invite_data = {};
async function create_guest_data_object(){
  //let message = {};
  //guest_data.display_name = document.getElementById('displayname').value;
  guest_data.display_name = $('input[name="displayname"]:checked').val();
  guest_data.expiry_date = picked_date;
  guest_data.sip_target = document.getElementById('sipuri').value;
  guest_data.offset = offset;
  //message.send_email = document.getElementById('email').value;
  //message.send_sms = document.getElementById('sms').value;
  return guest_data;
};

async function validate_message_object(message){
  if(!message.expiry_date || !message.sip_target){
    //console.log(`Bad data`);
    showMessage(`{"error":"Oops, you seem to be missing something.."}`);
    return false;
  } else {
    console.log (JSON.stringify(message));
    document.getElementById('selected_expiry').innerHTML = message.expiry_date;
    return true;
  }
};

async function post_data(){
  fetch('/create_url', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(guest_data),
  })
  .then(handleResponse)
  .then(showMessage)
  .catch(function(err) {
    showMessage(err.message);
  });
};

function buildTable(response_message){
  let table = $('<table>', {class:"link-table"})
    .append($('<tr>', {class:"link-row"})
      .append($('<td>', {class:"link-cell"}).text('Message'))
      .append($('<td>', {class:"link-cell"}).text(response_message['message']))
    ).append($('<tr>', {class:"link-row"})
      .append($('<td>', {class:"link-cell"}).text('URL'))
      .append($('<td>', {class:"link-cell"})
        .append($('<a>').attr("href", response_message['url'])
                        .attr("target", "_blank")
                        .text(response_message['url']))
      )
    ).append($('<tr>', {class:"link-row"})
      .append($('<td>', {class:"link-cell"}).text('Expires'))
      .append($('<td>', {class:"link-cell"}).text(response_message['expires']))
    )
  return table;
}

function showMessage(response_message) {
  //messages.textContent += `\n${message}`;
  //messages.textContent = `\n${response_message}`;
  $("#messages").empty();
  $("#messages").append(buildTable(JSON.parse(response_message)));
  //messages.innerHTML = ;
  messages.scrollTop = messages.scrollHeight;
  console.log(JSON.parse(response_message));
  if((JSON.parse(response_message)).url){
    guest_data.url = (JSON.parse(response_message)).url;
    guest_data.expires = (JSON.parse(response_message)).expires;
    console.log(`URL found - ${(JSON.parse(response_message)).url}`)
    document.getElementById('send_as_email_section').style.display = 'block';
    document.getElementById('guest_info_section').style.display = 'none';
  };
}

function handleResponse(response) {
  return response.ok
    ? response.json().then((data) => JSON.stringify(data, null, 2))
    : Promise.reject(new Error('Unexpected response'));
}


console.log(`timezone offset = ${offset}`);

async function send_to_email(){

  guest_data.send_to_email = document.getElementById('send_to_email').value;
  console.log(guest_data);

  fetch('/email_invite', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(guest_data),
  })
  .then(handleResponse)
  .then(showMessage)
  .catch(function(err) {
    showMessage(err.message);
  });


}

async function send_to_sms(){

  guest_data.send_to_mobile = document.getElementById('send_to_mobile').value;
  console.log(guest_data);
  /*
    fetch('/sms_ivite', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(message),
  })
  .then(handleResponse)
  .then(showMessage)
  .catch(function(err) {
    showMessage(err.message);
  });
  */
}
