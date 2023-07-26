function setRemoteHeight(offset){
  if(offset === undefined){
    offset = 0;
  }
  $("#remote").css({"height": 'calc(100% - ' + offset + 'px)'});
  $("#people").css({"max-height": 'calc(100% - ' + offset + 'px)'});
  console.log('remote height set');
}

if(headerToggle){
  setRemoteHeight(88);
} else {
  setRemoteHeight();
}

window.mobileCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function mobilePeopleSetup(){
  if(Math.abs(window.orientation) == 90){//landscape
    mobilePeopleLandscapeSetup();
  } else {//portrait
    mobilePeoplePortraitSetup();
  }
}

function mobilePeopleLandscapeSetup(){
  $('.member_option').each(function(){
    $(this).addClass('member_option_mobile_landscape');
    $(this).removeClass('member_option_mobile_portrait');
  });
  $('.member_name').each(function(){
    $(this).addClass('member_name_mobile_landscape');
    $(this).removeClass('member_name_mobile_portrait');
  });
}

function mobilePeoplePortraitSetup(){
  $('.member_option').each(function(){
    $(this).addClass('member_option_mobile_portrait');
    $(this).removeClass('member_option_mobile_landscape');
  });
  $('.member_name').each(function(){
    $(this).addClass('member_name_mobile_portrait');
    $(this).removeClass('member_name_mobile_landscape');
  });
}

function mobileSetup(){
  if(Math.abs(window.orientation) == 90){//landscape
    $('#remote').removeClass('remote_mobile_portrait');
    $('#remote').addClass('remote_desktop');
    $('#remote-view-video').removeClass('rvv_mobile_portrait');
    $('#people').removeClass('people_mobile_portrait');
    $('#people').addClass('people_mobile_landscape');
    $('#people-button_div').removeClass('people_button_mobile_portrait');
    $('#lobby-message-overlay').addClass("lobby-text-mobile-landscape");
    $('#lobby-message-overlay').removeClass("lobby-text-mobile-portrait");
    $(".md-top-bar").hide();
    mobilePeopleLandscapeSetup();
    setRemoteHeight();
    $("#settings-content i").each(function(){
      $(this).css({'font-size': ''});
    });
  } else {//portrait
    $('#remote').removeClass('remote_desktop');
    $('#remote').addClass('remote_mobile_portrait');
    $('#remote-view-video').addClass('rvv_mobile_portrait');
    $('#people').removeClass('people_mobile_landscape');
    $('#people').addClass('people_mobile_portrait');
    $('#people-button_div').addClass('people_button_mobile_portrait');
    $('#lobby-message-overlay').addClass("lobby-text-mobile-portrait");
    $('#lobby-message-overlay').removeClass("lobby-text-mobile-landscape");
    mobilePeoplePortraitSetup();
    if(headerToggle){
      $(".md-top-bar").show();
      setRemoteHeight(76);
    }
    $("#settings-content i").each(function(){
      $(this).css({'font-size': '4rem'});
    });
  }

  $(".custom-button").each(function(){
    let button = $(this);
    console.log(button);
    button.find('span').find('img').each(function(){
      let icon = $(this);
      button.removeClass("button-desktop")
      icon.removeClass("img-desktop");
      if(Math.abs(window.orientation) == 90){
        button.removeClass("button-mobile-portrait")
        button.addClass("button-mobile-landscape")
        icon.removeClass("img-mobile-portrait");
        icon.addClass("img-mobile-landscape");
      } else {
        button.removeClass("button-mobile-landscape")
        button.addClass("button-mobile-portrait")
        icon.removeClass("img-mobile-landscape");
        icon.addClass("img-mobile-portrait");
      }
      //$('.padit').css('padding', '20px');
    });
    });

}

let isMobile;
if(embedSize != "desktop" && embedSize != "mobile"){
  isMobile = mobileCheck();
  window.addEventListener("orientationchange", function(){
    mobileSetup();
  })

  if(isMobile){ //increase button sizes for mobile devices
    $('#lobby-message-overlay').removeClass("lobby-text-desktop");
    mobileSetup();
  }
} else {
  $('#remote').removeClass('remote_desktop');
  $('#remote').addClass('remote_mobile_portrait');
  $('#remote-view-video').addClass('rvv_mobile_portrait');
  $('#people').addClass('people_small');
  $('#people-button_div').addClass('people_button_small');
}


let timeout;
let flashTimeout;
let peopleButtonTimeout;
let isActiveMeeting = false;
let listenOnly = false;
let credentials = {
  logger: {
    level: "debug"
  }
};

//Deprecated
if(window.location.pathname.indexOf("licensed-sms") > 0){
  showSMS = true;
}

console.log(`sessionId:${sessionId}`)
console.log(`destination:${destination}`);
console.log(`token:${token}`);
console.log(`userType:${userType}`);
console.log(`backgroundImage:${backgroundImage}`);
console.log(`headerToggle:${headerToggle}`);
console.log(`listenOnlyOption:${listenOnlyOption}`);
console.log(`shareOnlyOption:${shareOnlyOption}`);
console.log(`meetButtonColor:${meetButtonColor}`);
console.log(`showSMS:${showSMS}`);
console.log(`showEmail:${showEmail}`);
console.log(`selfView:${selfView}`);
console.log(`rootUrl:${rootUrl}`);
console.log(`autoDial:${autoDial}`);
console.log(`autoRecord:${autoRecord}`);
console.log(`socketUrl:${socketUrl}`);
console.log(`embedSize:${embedSize}`);

$('body').css({'background-image':`url(${backgroundImage})`});

if(headerToggle){
  $(".myheader").show();
}

if(meetButtonColor !== null && meetButtonColor !== undefined){
  $('#call').css({"background-color":"#" + meetButtonColor});
  $('#call-listen').css({"background-color":"#" + meetButtonColor});
}

//Setup Soapbox conn: TODO
if(!socketUrl){
  socketUrl = "https://soapbox.wbx.ninja";
}
var socket = io(socketUrl, {query:`room=${sessionId}`});

function sendSocketMessage(data, room){
  if(!room){
    room = sessionId;
  }
  try{
    socket.emit('message', {"room":room, "data":data});
  }catch(e){
    console.log("Unable to send lobby waiting message to socketUrl:");
    console.log(e);
  }
}

if(userType == "guest"){
  console.log(`Found JWT - ${token}`);
} else {
  $('#main-title').text("Licensed User Access");
  console.log(`Found token - ${token}`);
  credentials.credentials = { access_token: token };
}

settingsPopup();
let pollMeetingStateInterval = 2000;
let maxCounterAttempts = 30;

const webex = (window.webex = Webex.init(credentials));

//-----
//AV Sources
const audioInputSelect = document.querySelector('select#audioSource');
const videoInputSelect = document.querySelector('select#videoSource');

const audio = {};
const video = {};

let mediaSettings = {
  receiveVideo: listenOnlyOption ? true : !shareOnlyOption,
  receiveAudio: listenOnlyOption ? true : !shareOnlyOption,
  receiveShare: true, //this should be true to split the inbound streams
  sendShare: false,
  sendVideo: !(listenOnlyOption || shareOnlyOption),
  sendAudio: !(listenOnlyOption || shareOnlyOption)
};

// setting up the devices
const selectors = [audioInputSelect, /*audioOutputSelect,*/ videoInputSelect];

//This requests the video/audio permissions at the beginning if we want to know them the whole time.
/*navigator.mediaDevices.getUserMedia({audio:true, video:true}).then((stream) => {
  console.log(stream);
})*/

navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
console.log(deviceInfos);
const values = selectors.map((select) => select.value);

selectors.forEach((select) => {
  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }
});

for (let i = 0; i !== deviceInfos.length; i += 1) {
  const deviceInfo = deviceInfos[i];
  const option = document.createElement('option');
  console.log(deviceInfo);
  option.value = deviceInfo.deviceId;
  if (deviceInfo.kind === 'audioinput') {
    option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
    audioInputSelect.appendChild(option);
  }
  else if (deviceInfo.kind === 'videoinput') {
    option.text = deviceInfo.label || `camera ${videoInputSelect.length + 1}`;
    videoInputSelect.appendChild(option);
  }
  else {
    console.log('Some other kind of source/device: ', deviceInfo);
  }
}
selectors.forEach((select, selectorIndex) => {
  if (Array.prototype.slice.call(select.childNodes).some((n) => n.value === values[selectorIndex])) {
    select.value = values[selectorIndex];
  }
})
}).catch(e => console.err(e));

let m, remoteShareStream;

webex.once("ready", () => {
  console.log(`Webex OBJ ready ${webex.version}`);
  if(userType == "guest"){
    webex.authorization
      .requestAccessTokenFromJwt({jwt:token})
      .then(finalizeWebexAuth)
      .catch(e => {
        console.error(e);
        alert(e);
      });
  } else {
    finalizeWebexAuth(null);
  }

});

function finalizeWebexAuth(data){
  if (webex.canAuthorize) {
    // Authorization is successful
    console.log("User Authenticated");
    console.log(`Data - ${JSON.stringify(webex)}`);

    webex.meetings.register()
      .then((data) => {
        if(autoDial){
          callFunction();
        } else {
          showStartButtons();  
        }
      })
      .catch(err => {
      console.error(err);
      alert(err);
      throw err;
    });
  }
}


function bindMeetingEvents(meeting) {
  console.log('This meeting', meeting);
  //meeting.setMeetingQuality('HIGH');
  meeting.on("error", err => {
    console.error("<Meeting error> -", err);
  });

  //meeting:stateChange
  meeting.on('meeting:stateChange', (payload) => {
    console.log("<meeting:stateChange>", payload);
    console.log(`currentState:${payload.payload.currentState}`);
    //resetMeeting(payload.payload.currentState == "INACTIVE", meeting);
    sendSocketMessage({"event":"meeting-state-change", "payload":payload.payload})
    if(payload.payload.currentState == "INACTIVE"){
      resetControls();
      //alert('The meeting was ended.'); // TODO: put an in page message for this.  alert() freezes video redraws so it looks stuck until ok is clicked.
    }
  });

  meeting.on('meeting:ringing', (payload) => {
    console.log("<meeting:ringing>", payload);
  });

  meeting.on('meeting:ringingStop', (payload) => {
    console.log("<meeting:ringingStop>", payload);
  });

  meeting.on('meeting:added', (payload) => {
    console.log("<meeting:added>", payload);
  });

  meeting.on('meeting:removed', (payload) => {
    console.log('<meeting:removed>');
  });

  meeting.on('meeting:locked', () => {
    console.log('<meeting:locked>');
  });

  meeting.on('meeting:unlocked', () => {
    console.log('<meeting:unlocked>');
  });

  meeting.on('meeting:self:lobbyWaiting', (payload) => {
    console.log('<meeting:self:lobbyWaiting>');
    console.log('User is guest to space, waiting to be admitted, wait to use addMedia');
    $('.lobby-waiting').show();
    console.log(payload.payload);
    console.log(meeting);
    sendSocketMessage({"event":"lobby-waiting", "payload":payload.payload});
  });

  meeting.on('meeting:actionsUpdate', (payload) => {
    console.log(`meeting:actionsUpdate - ${JSON.stringify(payload)}`);
  });

  meeting.on('meeting:reconnectionStarting', () => {
    console.log('<meeting:reconnectionStarting>');
  });

  meeting.on('meeting:reconnectionSuccess', () => {
    console.log('<meeting:reconnectionSuccess>');
    //setTimeout(() => { document.getElementById('log').innerHTML = ''; }, 5000);
  });

  meeting.on('meeting:reconnectionFailure', () => {
    console.log('<meeting:reconnectionFailure>');
  });

  meeting.on('meeting:self:guestAdmitted', () => {
    console.log('<meeting:self:guestAdmitted>');
    console.log('Admitted to meeting as guest to call');
    return addMedia(meeting);
  });

  meeting.on('meeting:self:left', (payload) => {
    console.log(`<meeting:self:left> - ${JSON.stringify(payload)}`);
  });

  meeting.on('meeting:self:mutedByOthers', () => {
    console.log('<meeting:self:mutedByOthers>');
  });

  meeting.on('meeting:stoppedSharingLocal', (payload) => {
    console.log(`<meeting:stoppedSharingLocal> - ${JSON.stringify(payload)}`);
    resetShareIcon();
    isSharing = false;
    document.getElementById('self-share').srcObject = null;
  });

  meeting.on('meeting:startedSharingLocal', (payload) => {
    console.log(`<meeting:startedSharingLocal> - ${JSON.stringify(payload)}`);
    $("#screen_share_off").hide();
    $("#screen_share_on").show();
    $("#screen_share").removeClass("button-grey");
    $("#screen_share").addClass("button-red");
  });

  meeting.on('meeting:startedSharingRemote', (payload) => {
    console.log(`<meeting:startedSharingLocal> - ${JSON.stringify(payload)}`);
  });

  meeting.on('meeting:stoppedSharingRemote', (payload) => {
    //document.getElementById("remote-view-share").srcObject = null;
    console.log(`<meeting:stoppedSharingRemote> - ${JSON.stringify(payload)}`);
  });


  // Handle media streams changes to ready state
  meeting.on("media:ready", media => {
    console.log('media:ready', media);
    if (!media) {
      return;
    }
    if (media.type === "local") {
      document.getElementById("self-view").srcObject = media.stream;
      if(selfView){
        $('#remote-view-video').show();
        $('#self-view').show();
      }
    }
    if (media.type === "remoteVideo") {
      console.log('remoteVideo media received.');
      document.getElementById("remote-view-video").srcObject = media.stream;
      $('#remote-view-video').show();
    }
    if (media.type === "remoteAudio") {
      document.getElementById("remote-view-audio").srcObject = media.stream;
    }
    if (media.type === 'remoteShare') {
      // Remote share streams become active immediately on join, even if nothing is being shared
      console.log('remoteShare media received.');
      //document.getElementById("remote-view-share").srcObject = media.stream;
      //$('#remote-view-share').show();
    }
    if (media.type === 'localShare') {
      document.getElementById('self-share').srcObject = media.stream;
      $('#self-share').show();
    }
  });

  // Handle media streams stopping
  meeting.on("media:stopped", media => {
    console.log('media:stopped', media);
    // Remove media streams
    resetControls();
    isActiveMeeting = false;
    listenOnly = false;
    shareOnly = false;
    if (media.type === "local") {
      document.getElementById("self-view").srcObject = null;
    }
    if (media.type === "remoteVideo") {
      document.getElementById("remote-view-video").srcObject = null;
    }
    if (media.type === "remoteAudio") {
      document.getElementById("remote-view-audio").srcObject = null;
    }
    if (media.type === 'remoteShare') {
      //document.getElementById("remote-view-share").srcObject = null;
    }
  });

  //careful - this event is on meeting.members, not meeting.
  meeting.members.on('members:update', (payload) => {
    console.log("<members:update>", payload);
    sendSocketMessage({"event":"members-update", "payload":payload.delta});
    updateMeetingMembers(payload.delta, meeting);
  });

  let isSharing = false;
  document.getElementById("screen_share").addEventListener("click", () => {
    console.log('TOGGLE SCREENSHARE');
    console.log(`isSharing: ${isSharing}`);
    if(isSharing){
      isSharing = false;
      meeting.stopShare();
      document.getElementById("self-share").srcObject = null;
      resetShareIcon();
    } else {
      isSharing = true;
      meeting.shareScreen()
        .then(() => {
          console.info('SHARE-SCREEN: Screen successfully added to meeting.');
        })
        .catch((e) => {
          console.error('SHARE-SCREEN: Unable to share screen, error:');
          console.error(e);
        });
    }
  });

  // Toggle video mute in the meeting:
   document.getElementById("video_mute").addEventListener("click", () => {
     console.log('TOGGLE VIDEO MUTE');
     if(meeting.isVideoMuted()){
       meeting.unmuteVideo()
       resetVideoIcon();
     } else {
       meeting.muteVideo();
       $("#video_mute_off").hide();
       $("#video_mute_on").show();
       $("#video_mute").removeClass("button-grey");
       $("#video_mute").addClass("button-red");
     }
   });

 // Toggle audio mute in the meeting:
  document.getElementById("audio_mute").addEventListener("click", () => {
    console.log('TOGGLE AUDIO MUTE');
    if(meeting.isAudioMuted()){
      meeting.unmuteAudio()
      resetAudioIcon();
    } else {
      meeting.muteAudio();
      $("#audio_mute_off").hide();
      $("#audio_mute_on").show();
      $("#audio_mute").removeClass("button-grey");
      $("#audio_mute").addClass("button-red");
    }
  });

  document.getElementById("videoSource").addEventListener("change", function (event){
    let selectedVal = $('#videoSource').find(":selected").val();
    console.log(selectedVal);
    const {sendVideo, receiveVideo} = {sendVideo:true, receiveVideo:true};
    stopMediaTrack('video', meeting);
    if(meeting.isVideoMuted()) meeting.unmuteVideo();
    return meeting.getMediaStreams({sendVideo, receiveVideo}, {video : {deviceId: {exact: selectedVal}}})
      .then(mediaStreams => {
        const [localStream, localShare] = mediaStreams;
        meeting.updateVideo({
          sendVideo,
          receiveVideo,
          stream: localStream
        });
        setTimeout(() => {
          console.log('second video update');
          meeting.updateVideo({sendVideo, receiveVideo, stream:localStream});
        }, 2000);
        resetVideoIcon();
      })
      .catch((error) => {
        console.log('MeetingControls#setVideoInputDevice :: Unable to set video input device');
        console.error(error);
      });

  });

  document.getElementById("audioSource").addEventListener("change", function (event){
    let selectedVal = $('#audioSource').find(":selected").val();
    console.log(selectedVal);
    const {sendAudio, receiveAudio} = {sendAudio:true, receiveAudio:true};
    stopMediaTrack('audio', meeting);
    if(meeting.isAudioMuted())meeting.unmuteAudio();
    return meeting.getMediaStreams({sendAudio, receiveAudio}, {audio : {deviceId: {exact: selectedVal}}})
      .then(mediaStreams => {
        const [localStream, localShare] = mediaStreams;
        meeting.updateAudio({
          sendAudio,
          receiveAudio,
          stream: localStream
        });
        setTimeout(() => {
          console.log('second audio update');
          meeting.updateVideo({sendAudio, receiveAudio, stream:localStream});
        }, 2000);
        resetAudioIcon();
      })
      .catch((error) => {
        console.log('MeetingControls#setAudioInputDevice :: Unable to set audio input device');
        console.error(error);
      });
  });

  document.getElementById("videoLayout").addEventListener("change", function (event){
    console.log(event);
    let selectedVal = $('#videoLayout').find(":selected").val();
    console.log(selectedVal);
    meeting.changeVideoLayout(selectedVal);
  });

  // Of course, we'd also like to be able to leave the meeting:
  document.getElementById("hangup").addEventListener("click", () => {
    document.getElementById("self-view").srcObject = null;
    document.getElementById("self-share").srcObject = null;
    document.getElementById("remote-view-video").srcObject = null;
    document.getElementById("remote-view-audio").srcObject = null;
    resetMeeting(meeting.state != "JOINED" || meeting.meetingState == "INACTIVE", meeting);
  });

}

function updateMeetingMembers(deltaMeetingMembers, meeting){
  let meetingMembers = deltaMeetingMembers.added.concat(deltaMeetingMembers.updated);
  for(let user of meetingMembers){
    if($('#user_div_'+user.id).length){
      $('#user_div_'+user.id).remove();
    }
    let member = $(`<div id="user_div_${user.id}" class="member">`);
    let name = user.name;
    if(user.isSelf){
      name += " (You)";
    } else if(user.isSiteInternal == false){
      name += " (Guest)";
    }
    let memberName = $('<div class="member_name">');
    let memberOption = null;
    member.append(memberName.text(name));
    let myself = meeting.members.membersCollection.members[meeting.selfId];
    if(user.isInLobby){
      if(myself.isModerator){
        memberOption = $(`<img id="${user.id}" src="/images/icons/enter-room_16_w.png" class="member_option member_admit_icon">`);
        member.prepend(
          $('<div>').append(memberOption
            .on('click', function(e){
              console.log('click');
              console.log(this.id);
              meeting.admit([this.id]);
            }))
        );
      }
      $('#lobby-members').append(member);
    } else if(user.isInMeeting) {
      if(user.isAudioMuted){
        memberOption = $('<img src="/images/icons/microphone-muted_16_w.png" class="member_option member_mute_icon">');
        member.prepend($('<div>').append(memberOption));
      }
      $('#meeting-members').append(member);
    }
    if(isMobile){
      mobilePeopleSetup();
    }
    if(meeting.meetingState != "INACTIVE" && meeting.state != "LEFT"){
      if($('#lobby-members').children().length > 0){
        console.log('there is someone in the lobby.');
        $('#lobby').show();//prepare the lobby when someone views people roster
        if($("#people").is(":visible") == false && !myself.isInLobby){
          showLobbyWaitingIcon();
        }
      } else {//no one is in the lobby
        $('#lobby').hide();
        resetLobbyIcon();
      }
      if(peopleButtonTimeout){ clearTimeout(peopleButtonTimeout)}
      peopleButtonTimeout = setTimeout(fadeOutPeopleButton, 3000);
    }
  }
}

$("#people-button").on("click", () => {
  console.log('people button');
  var people = $("#people");
  people.animate({width:'toggle'});
  if($("#people").is(":visible")){ //viewing the lobby
    resetLobbyIcon();
  }
  if(peopleButtonTimeout){ clearTimeout(peopleButtonTimeout)}
    peopleButtonTimeout = setTimeout(fadeOutPeopleButton, 3000);
});

function stopMediaTrack(type, meeting) {
  if (!meeting) return;
  const {audioTrack, videoTrack, shareTrack} = meeting.mediaProperties;
  // eslint-disable-next-line default-case
  switch (type) {
    case 'audio':
      audioTrack.stop();
      break;
    case 'video':
      videoTrack.stop();
      break;
    case 'share':
      shareTrack.stop();
      break;
  }
}

function showVideoElements(){
  $("#self-view").show();
  $("#self-share").show();
  $("#remote-view-video").show();
  //$("#remote-view-share").show();
}

function hideVideoElements(){
  $("#self-view").hide();
  $("#self-share").hide();
  $("#remote-view-video").hide();
  //$("#remote-view-share").hide();
}

function resetShareIcon(){
  $("#screen_share_off").show();
  $("#screen_share_on").hide();
  $("#screen_share").removeClass("button-red");
  $("#screen_share").addClass("button-grey");
}

function resetAudioIcon(){
  $("#audio_mute_off").show();
  $("#audio_mute_on").hide();
  $("#audio_mute").removeClass("button-red");
  $("#audio_mute").addClass("button-grey");
}

function resetVideoIcon(){
  $("#video_mute_off").show();
  $("#video_mute_on").hide();
  $("#video_mute").removeClass("button-red");
  $("#video_mute").addClass("button-grey");
}

function resetLobbyIcon(){
  $('#people-button').removeClass('button-blue');
  $("#people-button-list").show();
  $("#people-button-wait").hide();
}

function resetLobbyWaiting(){
  $('.lobby-waiting').hide();
}

function clearPeopleFlash(){
  $('#people-button').removeClass('flash');
}

function showLobbyWaitingIcon(){
  console.log('showLobbyWaiting');
  $('#people-button_div').show();
  //$('#people-button').addClass('flash');
  //if(!flashTimeout){flashTimeout = setTimeout(clearPeopleFlash, 3000)}
  $('#people-button').addClass('button-blue');
  $("#people-button-wait").show();
  $("#people-button-list").hide();
}

function resetSettings(){
  $("#settings-popup").hide();
  viewSettings = false;
  $("#settings_off").show();
  $("#settings_on").hide();
}

let inMeetingDivs = ["audio_mute", "video_mute", "share_screen", "settings"]
function showControls(){
  if(isActiveMeeting){
    showHangup();
    for(let i in inMeetingDivs){
      $(`#${inMeetingDivs[i]}_div`).show();
    }
    $('#people-button_div').show();
    if(timeout) clearTimeout(timeout);
    if(peopleButtonTimeout) clearTimeout(peopleButtonTimeout);
    timeout = setTimeout(fadeOutControls, 3000);
  }
}

function debugShowControls(){
  showHangup();
  for(let i in inMeetingDivs){
    $(`#${inMeetingDivs[i]}_div`).show();
  }
  $('#people-button_div').show();
}

function fadeOutPeopleButton(){
  if($("#people").is(":visible") == false && $("#people-button-wait").is(":visible") == false){
    $('#people-button_div').fadeOut();
  }
}

function fadeOutControls(){
  $("#hangup_div").fadeOut();
  for(let i in inMeetingDivs){
    $(`#${inMeetingDivs[i]}_div`).fadeOut();
  }
  fadeOutPeopleButton();
}

function showLayoutSelect(){
  $("#layout_select").show();
}

function showHangup(){
  $("#hangup_div").show();
  $("#call_div").hide();
  if(listenOnlyOption){ $("#call_listen_div").hide(); }
  if(shareOnlyOption) { $("#share_screen_div").show();}
  $("#sms_div").hide();
}

function showStartButtons(){
  $("#call_div").show();
  if(showSMS && userType != "guest"){
    $("#sms_div").show();
  } 
  if(showEmail && userType != "guest"){
    $("#email_div").show();
  } 
  if(listenOnlyOption) {
    $("#call_listen_div").show();
  }
  if(shareOnlyOption) {
    // do we need another join button here?
  }
  resizeCallButtonDiv();
}

function resizeCallButtonDiv(){
  let numButtonsShown = $('.call-button:visible').length;
  let maxWidth = numButtonsShown * 5;
  $("#call_buttons").css({"max-width":`${maxWidth}rem`});
  console.log(numButtonsShown);
}

function resetParticipantList(){
  $('#people-button_div').hide();
  $('#people').hide();
  $('#lobby-members').empty();
  $('#meeting-members').empty();
}

function resetControls(){
  console.log('resetControls');
  //socket.emit('message', {"room":sessionId, "data":{"event":"members-update", "payload":payload.delta}});
  showStartButtons();
  $("#hangup_div").hide();
  for(let i in inMeetingDivs){
    $(`#${inMeetingDivs[i]}_div`).hide();
  }
  resetParticipantList();
  resetShareIcon();
  resetAudioIcon();
  resetVideoIcon();
  resetLobbyIcon();
  resetLobbyWaiting();
  resetSettings();
  hideVideoElements();
}

function resetMeeting(condition, meeting){
  if(condition){
    console.log('condition to reset meeting met.')
    resetControls();
  }
  try{
    meeting.leave(meeting.id);
  } catch (e) {
    console.log('caught meeting.leave error:');
    console.log(e);
  }
}

function addMediaFunction(meeting, localStream, localShare) {
  //showVideoElements();
  meeting.addMedia({localShare, localStream, mediaSettings});

  if(localStream) {
    let myTracks = localStream.getTracks();
    meeting.getDevices().then(devices => {
      console.log("devices:");
      console.log(devices);
      for(var i in devices){
        let selector = "audioSource";
        if(devices[i].kind == "videoinput"){
          selector = "videoSource";
        }
        selected = false;
        for(var j in myTracks){
          if(myTracks[j].kind + "Source" == selector && myTracks[j].label == devices[i].label){
            selected = true;
          }
        }
        $(`#${selector} option[value="${devices[i].deviceId}"]`).text(devices[i].label).prop('selected', selected);
      }
      isActiveMeeting = true;
      showControls();
      resizeCallButtonDiv();
      resetLobbyWaiting();
      if(autoRecord && userType != "guest"){
        meeting.startRecording().then(r => {
          console.log('startRecording res:' + r);
        });
      }
    });
  }
}

function addMedia(meeting){
  if(listenOnly === true){
    if(meeting.state == "JOINED"){
      meeting.addMedia({mediaSettings});
    } else {
      console.log('**Not joined, waiting for admission event.');
    }
  } else {
    if(shareOnlyOption || listenOnlyOption) {
      addMediaFunction(meeting, undefined, undefined);
    } else {
      // Get our local media stream and add it to the meeting
      return meeting.getMediaStreams(mediaSettings,{audio:true, video:true}).then(mediaStreams => {
        const [localStream, localShare] = mediaStreams;
        if(meeting.state == "JOINED"){
          addMediaFunction(meeting, localStream, localShare);
        } else {
          console.log('**Not joined, waiting for admission event.');
        }
      }).catch((error => console.log(error)));
    }
  }
}

// Join the meeting and add media
function joinMeeting(meeting) {
  let connectCounter = 0;
  //showVideoElements();
  return meeting.join().then(() => {
    addMedia(meeting);
  });
}

function callFunction(event){
  showHangup();
  try{
    event.preventDefault();
  }catch(e){}
  console.log(`got destination - ${destination}`);
  // attaching before the request
  audio.deviceId = {exact: audioInputSelect.value};
  audio.noiseSuppression=false;
  audio.echoCancellation=true;
  video.deviceId = {exact: videoInputSelect.value};
  return webex.meetings.create(destination)
    .then(meeting => {
      // Call our helper function for binding events to meetings
      bindMeetingEvents(meeting);
      return joinMeeting(meeting);
    })
    .catch(error => {
      // Report the error
      console.error(error);
      alert(error);
      resetControls();
    });
}

function callButtonFunction(event){
  callFunction(event);
}

function callButtonListenFunction(event){
  listenOnly = true;
  callFunction(event);
}

async function getGuestUrl(){
  let guestUrl;
  let path = "/";
  if(rootUrl !== undefined){
    let link = window.location.toString();
    let sessionId = link.split(rootUrl)[1].split('/')[1];
    guestUrl = rootUrl + 'guest/' + sessionId; 
    path = rootUrl.replace(window.location.origin, "");
  } else {
    guestUrl = await create_url();
  }
  console.log(`guestUrl:${guestUrl}`);
  console.log(`path:${path}`);
  return [guestUrl, path];
}

async function smsButtonFunction(event){
  const [guestUrl, path] = await getGuestUrl();
  smsFunction(guestUrl, path);
}

async function emailButtonFunction(event){
  const [guestUrl, path] = await getGuestUrl();
  emailFunction(guestUrl, path);
}

document.getElementById("call").addEventListener("click", callButtonFunction);
document.getElementById("call-listen").addEventListener("click", callButtonListenFunction);
document.getElementById("sms").addEventListener("click", smsButtonFunction);
document.getElementById("email").addEventListener("click", emailButtonFunction);
document.addEventListener("mousemove", showControls);


if(userType != "guest"){
  // Listen incoming calls
  webex.meetings.on('meeting:added', (addedMeetingEvent) => {
  if (addedMeetingEvent.type === 'INCOMING') {
    const addedMeeting = addedMeetingEvent.meeting;

    // Acknowledge to the server that we received the call on our device
    addedMeeting.acknowledge(addedMeetingEvent.type)
      .then(() => {
        if (confirm('Answer incoming call')) {
          bindMeetingEvents(addedMeeting);
          joinMeeting(addedMeeting);
        }
        else {
          addedMeeting.decline();
        }
      });
  }
  });
}

let viewSettings = false;
function settingsPopup(){
  $("#settings").on('click', function(){
    if(viewSettings){
      resetSettings();
    } else {
      $("#settings-popup").show();
      viewSettings = true;
      $("#settings_off").hide();
      $("#settings_on").show();
    }
  });

  $("#close-settings").on('click', function(){
    resetSettings();
  });

  $("#settings-popup").on('click', function(e){
    if(e.target.id=="settings-popup"){
      resetSettings();
    }
  });

}
