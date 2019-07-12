const offset = new Date().getTimezoneOffset();
const 
let picked_date;

flatpickr("#flatpckr", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  minDate: "today",
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
    create_message_object()
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
let message = {};
async function create_message_object(){
  //let message = {};
  message.display_name = document.getElementById('displayname').value;
  message.expiry_date = picked_date;
  message.sip_target = document.getElementById('sipuri').value;
  message.offset = offset;
  //message.send_email = document.getElementById('email').value;
  //message.send_sms = document.getElementById('sms').value;
  return message;
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
    body: JSON.stringify(message),
  })
  .then(handleResponse)
  .then(showMessage)
  .catch(function(err) {
    showMessage(err.message);
  });
};

function showMessage(message) {
  //messages.textContent += `\n${message}`;
  messages.textContent = `\n${message}`;
  messages.scrollTop = messages.scrollHeight;
  console.log(JSON.parse(message));
  if((JSON.parse(message)).url){
    console.log(`URL found - ${(JSON.parse(message)).url}`)
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