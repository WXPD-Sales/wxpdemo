const offset = new Date().getTimezoneOffset();
var today = new Date();
today.setHours(today.getHours() + 8);//This will add an extra hour when crossing the DST switch over, but not a big deal.
//var defaultDate = new Date(today);
//defaultDate.setDate(today.getDate() + 1);
//var time = today.toISOString().slice(11,16);
//let picked_date = defaultDate.toISOString().slice(0,10) + " " + time;
function getPickedDateStr(addDay){
  if(addDay == undefined){
    addDay = 0;
  }
  return today.getFullYear() + "-" + ('0' + (today.getMonth()+1)).slice(-2) + "-" + ('0' + (today.getDate() + addDay)).slice(-2) + " " + today.toLocaleTimeString();
}
let picked_date = getPickedDateStr();
//let picked_date =  today.toLocaleTimeString();
document.getElementById('selected_expiry').innerHTML = picked_date;
//console.log(`today is ${time}`);
console.log(`today is ${today}`);
console.log(picked_date);
let urlPath = window.location.pathname;
let deployPath = urlPath.split('/linkgen')[0];
console.log(deployPath);

today.toLocaleTimeString().slice(0,5)
//TODO: fix timepicker not date.

flatpickr("#flatpckr",{
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    defaultDate: ('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2),
    onChange: function(selectedDates, dateStr, instance) {
      let hr_min_array = dateStr.split(':');
      today.setHours(parseInt(hr_min_array[0],10));
      today.setMinutes(parseInt(hr_min_array[1],10));
      let current = new Date();
      let addDay = 0;
      if(today < current){
        addDay = 1;
      }
      picked_date = getPickedDateStr(addDay);
      document.getElementById('selected_expiry').innerHTML = picked_date;
    },
});
/*
flatpickr("#flatpckr", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  minDate: "today",
  minTime: time,
  defaultDate: picked_date,
  onChange: function(selectedDates, dateStr, instance) {
    console.log(`selection changed ${dateStr} `);
    picked_date = dateStr;
    document.getElementById('selected_expiry').innerHTML = picked_date;
  },
  allowInput: true,
});*/

// It's all sliders
var sliderPicker = new iro.ColorPicker("#sliderPicker", {
  width: 300,
  color: "rgb(36, 171, 49)",
  borderWidth: 1,
  borderColor: "#fff",
  layout: [
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'hue'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'saturation'
      }
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: 'value'
      }
    },
  ]
});

sliderPicker.on(['color:init', 'color:change'], function(color) {
  // log the current color as a HEX string
  //console.log(color.hexString);
  $('#selectedColor').css({"background-color":color.hexString});
});

console.log(Cookies.get("avatar"));

let create_button = document.getElementById('create_button');
create_button.onclick = function (event){
  try {
    let guest_data = create_guest_data_object();
    post_data(guest_data);
  } catch (err){
    console.log(err);
  }
}

$("#sipuri").focus(function(){
  $('.radio-input[name=sip_uri][value=custom]').prop("checked", true);
})

$("#sip_uri_radio-pmr").click(function(){
  $('.radio-input[name=sip_uri][value=pmr]').prop("checked", true);
})

$("#sip_uri_radio-hour").click(function(){
  $('.radio-input[name=sip_uri][value=ad_hoc]').prop("checked", true);
})

function create_guest_data_object(){
  let guest_data = {};
  let sipval = $("input[type='radio'][name='sip_uri']:checked").val();
  if(sipval == "custom") sipval = document.getElementById('sipuri').value;
  guest_data.sip_target = sipval;
  guest_data.expiry_date = picked_date;
  guest_data.offset = offset;
  guest_data.background_url = document.getElementById('background_url').value;
  guest_data.header_toggle = $("#pageHeaderToggle").prop('checked');
  guest_data.listen_only_option = $("#listenOnlyOption").prop('checked');
  guest_data.meet_button_color = sliderPicker.color.hexString;
  return guest_data;
};


async function post_data(guest_data){
  fetch(deployPath + '/create_url', {
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

function copyFunction(url){
  const el = document.createElement('textarea');
  el.value = url;
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0,99999); /*for mobile devices*/
  document.execCommand("copy");
  document.body.removeChild(el);
}

function buildTable(response_message){
  let table = $('<table>', {class:"link-table"})
      .append($('<tr>')
        .append($('<td>', {class:"link-cell"}).text('Message'))
        .append($('<td>', {class:"link-cell"}).text(response_message['message'])))
  if(response_message.hasOwnProperty('expires'))
    table.append($('<tr>')
      .append($('<td>', {class:"link-cell"}).text('Expires'))
      .append($('<td>', {class:"link-cell"}).text(response_message['expires']))
    )
  if(response_message.hasOwnProperty('urls')){
    for(let urlType in response_message['urls']){
      table.append($('<tr>', {class:"header-row"})
        .append($('<td>', {class:"link-cell", "style":"font-weight:bold"}).text(urlType + ' User URLs'))
        .append($('<td>', {class:"link-cell"})));
      for(let url in response_message['urls'][urlType]){
        let cellTitle = "SDK";
        if(response_message['urls'][urlType][url].indexOf("widget") > 0){
          cellTitle = "Widget";
        } else if(response_message['urls'][urlType][url].indexOf("sms") > 0){
          cellTitle = "SDK + SMS";
        }
        table.append($('<tr>')
          .append($('<td>', {class:"link-cell"}).text(cellTitle))
          .append($('<td>', {class:"link-cell"})
            .append($('<a>').attr("id", "generated-link-url")
                            .attr("href", response_message['urls'][urlType][url])
                            .attr("target", "_blank")
                            .text(response_message['urls'][urlType][url]))
            .append($('<button>', {class:'md-button md-button--circle md-button--32 copy-button', onclick:'copyFunction("'+response_message['urls'][urlType][url]+'")'})
              .append($('<i>', {class:'cui-icon icon icon-copy_16'})))
            .append($('<button>', {class:'md-button md-button--circle md-button--32 sms-button', onclick:'smsFunction("'+response_message['urls'][urlType][url]+'","'+deployPath+'")'})
              .append($('<img>', {class:'', src:"images/icons/sms_16.png"})))
          )
        )
      }
    }
  }

  return table;
}

function showMessage(response_message) {
  if(response_message == "null"){
    alert("Error: Cannot Find PMR for you. Please enter a SIP URI or roomId");
  } else {
    console.log(response_message)
    let jResponse = JSON.parse(response_message);
    $("#messages").empty();
    $("#messages").append(buildTable(jResponse));
    messages.scrollTop = messages.scrollHeight;
    console.log(jResponse);
    if(jResponse.hasOwnProperty('urls')){
      console.log(`URL found - ${jResponse.urls}`)
      document.getElementById('send_as_email_section').style.display = 'block';
      document.getElementById('guest_info_section').style.display = 'none';
    };
  }

}

function handleResponse(response) {
  return response.ok
    ? response.json().then((data) => JSON.stringify(data, null, 2))
    : Promise.reject(new Error('Unexpected response'));
}


console.log(`timezone offset = ${offset}`);

/*
async function send_to_email(){
  guest_data.send_to_email = document.getElementById('send_to_email').value;
  console.log(guest_data);
  fetch(deployPath + '/email_invite', {
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
}*/
