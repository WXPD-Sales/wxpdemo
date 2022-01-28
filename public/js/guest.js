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
    $('#remote').addClass('remote_desktop');
    $('#remote-view-video').removeClass('rvv_mobile_portrait');
    $('#people').removeClass('people_mobile_portrait');
    $('#people').addClass('people_mobile_landscape');
    $('#people-button_div').removeClass('people_button_mobile_portrait');
    $(".md-top-bar").hide();
    mobilePeopleLandscapeSetup();
    setRemoteHeight();
    $("#settings-content i").each(function(){
      $(this).css({'font-size': ''});
    });
  } else {//portrait
    $('#remote').removeClass('remote_desktop');
    $('#remote-view-video').addClass('rvv_mobile_portrait');
    $('#people').removeClass('people_mobile_landscape');
    $('#people').addClass('people_mobile_portrait');
    $('#people-button_div').addClass('people_button_mobile_portrait');
    mobilePeoplePortraitSetup();
    if(headerToggle){
      $(".md-top-bar").show();
      setRemoteHeight(76);
    }
    $("#settings-content i").each(function(){
      $(this).css({'font-size': '4rem'});
    });
  }

  $(".md-button").each(function(){
    let button = $(this);
    console.log(button);
    button.find('span').find('img').each(function(){
      let icon = $(this);
      icon.removeClass("desktopImg");
      if(Math.abs(window.orientation) == 90){
        button.css({"width":"5rem", "height":"5rem"})
        icon.removeClass("mobilePortraitImg");
        icon.addClass("mobileLandscapeImg");
      } else {
        button.css({"width":"10rem", "height":"10rem"})
        icon.removeClass("mobileLandscapeImg");
        icon.addClass("mobilePortraitImg");
      }
      //$('.padit').css('padding', '20px');
    });
    });

}

let isMobile = mobileCheck();
window.addEventListener("orientationchange", function(){
  mobileSetup();
})

if(isMobile){ //increase button sizes for mobile devices
  mobileSetup();
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

showSMS = false;
if(window.location.pathname.indexOf("licensed-sms") > 0 || urlShowSMS){
  showSMS = true;
}

console.log(destination);
console.log(token);
console.log(userType);
console.log(backgroundImage);
console.log(headerToggle);
console.log(listenOnlyOption);
console.log(meetButtonColor);
console.log(showSMS);

$('body').css({'background-image':`url(${backgroundImage})`});

if(headerToggle){
  $(".myheader").show();
}

if(meetButtonColor !== null && meetButtonColor !== undefined){
  $('#call').css({"background-color":"#" + meetButtonColor});
  $('#call-listen').css({"background-color":"#" + meetButtonColor});
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
const mediaSettings = {
  receiveVideo: true,
  receiveAudio: true,
  receiveShare: false, //this should be true to split the inbound streams
  sendShare: false,
  sendVideo: true,
  sendAudio: true
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

//-----



let m, remoteShareStream;

webex.once("ready", () => {
  console.log(`Webex OBJ ready ${webex.version}`);
  if(userType == "guest"){
    webex.authorization
      .requestAccessTokenFromJwt({jwt:token})
      .then(finalizeWebexAuth)
      .catch(e => {
        console.error(e);
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
        showStartButtons();
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

  meeting.on('meeting:self:lobbyWaiting', () => {
    console.log('<meeting:self:lobbyWaiting>');
    console.log('User is guest to space, waiting to be admitted, wait to use addMedia');
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
    $("#screen_share").removeClass("md-button--grey");
    $("#screen_share").addClass("md-button--red");
  });

  meeting.on('meeting:startedSharingRemote', (payload) => {
    console.log(`<meeting:startedSharingLocal> - ${JSON.stringify(payload)}`);
  });

  meeting.on('meeting:startedSharingRemote', (payload) => {
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
      //showVideoElements();
      //$('#self-view').show();
    }
    if (media.type === "remoteVideo") {
      console.log('remoteVideo media received.');
      document.getElementById("remote-view-video").srcObject = media.stream;
      //showVideoElements();
      //$('#remote-view-video').show();
    }
    if (media.type === "remoteAudio") {
      document.getElementById("remote-view-audio").srcObject = media.stream;
    }
    if (media.type === 'remoteShare') {
      // Remote share streams become active immediately on join, even if nothing is being shared
      console.log('remoteShare media received.');
      document.getElementById("remote-view-share").srcObject = media.stream;
      //showVideoElements();
      //$('#remote-view-share').show();
    }
    if (media.type === 'localShare') {
      document.getElementById('self-share').srcObject = media.stream;
      //showVideoElements();
      //$('#self-share').show();
    }
  });

  // Handle media streams stopping
  meeting.on("media:stopped", media => {
    console.log('media:stopped', media);
    // Remove media streams
    resetControls();
    isActiveMeeting = false;
    listenOnly = false;
    if (media.type === "local") {
      document.getElementById("self-view").srcObject = null;
    }
    if (media.type === "remoteVideo") {
      document.getElementById("remote-view-video").srcObject = null;
    }
    if (media.type === "remoteAudio") {
      document.getElementById("remote-view-audio").srcObject = null;
    }
  });

  //careful - this event is on meeting.members, not meeting.
  meeting.members.on('members:update', (payload) => {
    console.log("<members:update>", payload);
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
       $("#video_mute").removeClass("md-button--grey");
       $("#video_mute").addClass("md-button--red");
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
      $("#audio_mute").removeClass("md-button--grey");
      $("#audio_mute").addClass("md-button--red");
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
  //console.log(JSON.stringify(deltaMeetingMembers));
  //TODO:DELETE THIS!
  /*
  deltaMeetingMembers = {"added":[],"updated":[{"namespace":"Meetings","participant":{"isCreator":true,"identity":"cb9bf613-facd-4927-812f-5337ffe643b8","url":"https://locus-b.wbx2.com/locus/api/v1/loci/7f501849-ebdd-3a7…429a79a7c44/participant/c0f630ff-e664-3e72-8ee7-b33d36fc7373","state":"JOINED","type":"USER","isSiteInternal":true,"person":{"id":"cb9bf613-facd-4927-812f-5337ffe643b8","name":"Taylor Hanson (WXSD)","isExternal":false,"orgId":"952e87f4-5c49-4ca1-b285-ee0570c2498c","incomingCallProtocols":[]},"devices":[{"url":"https://wdm-r.wbx2.com/wdm/api/v1/devices/6a8769c0-7cdd-4bcc-a15c-c59511d75ef2","deviceType":"WEB","state":"JOINED","intents":[null],"correlationId":"a94169a0-839c-4851-99c2-60f2de8562f5","isVideoCallback":false,"csis":[2623864320,2623864321,1671102721,1671102720],"replaces":[]}],"status":{"audioStatus":"RECVONLY","videoStatus":"SENDRECV","videoSlidesStatus":"INACTIVE","audioSlidesStatus":"INACTIVE","csis":[2623864320,2623864321,1671102721,1671102720]},"controls":{"audio":{"muted":false,"requestedToUnmute":false,"localAudioUnmuteRequired":false,"disallowUnmute":false,"meta":{}},"video":{"muted":false,"meta":{}},"localRecord":{"recording":false,"meta":{}},"layouts":[{"type":"ActivePresence","deviceUrl":"https://wdm-r.wbx2.com/wdm/api/v1/devices/6a8769c0-7cdd-4bcc-a15c-c59511d75ef2"}],"role":{"presenter":false,"roles":[{"type":"COHOST","hasRole":true,"meta":{"lastModified":"2022-01-26T23:13:56.596Z"}},{"type":"MODERATOR","hasRole":true,"meta":{"lastModified":"2022-01-26T23:13:56.596Z"}},{"type":"PRESENTER","hasRole":false,"meta":{"lastModified":"2022-01-26T23:13:43.144Z"}}]}},"doesNotSupportBreakouts":true,"id":"c0f630ff-e664-3e72-8ee7-b33d36fc7373","guest":false,"resourceGuest":false,"moderator":true,"panelist":false,"moveToLobbyNotAllowed":true,"cmrHost":true,"deviceUrl":"https://wdm-r.wbx2.com/wdm/api/v1/devices/6a8769c0-7cdd-4bcc-a15c-c59511d75ef2"},"id":"c0f630ff-e664-3e72-8ee7-b33d36fc7373","name":"Taylor Hanson (WXSD)","isAudioMuted":true,"isVideoMuted":false,"isSelf":true,"isHost":true,"isGuest":false,"isInLobby":false,"isInMeeting":true,"isNotAdmitted":false,"isContentSharing":false,"status":"IN_MEETING","isDevice":false,"isUser":true,"associatedUser":null,"isRecording":false,"isMutable":false,"isRemovable":false,"type":"MEETING","isModerator":true},{"namespace":"Meetings","participant":{"isCreator":false,"identity":"580cd72a-2d00-44dd-b608-a8b8a32d0cd7","url":"https://locus-b.wbx2.com/locus/api/v1/loci/7f501849-ebdd-3a7…429a79a7c44/participant/73f5e1f8-b807-319c-b95d-4598d7ee6a80","state":"LEFT","reason":"INACTIVE","type":"USER","isSiteInternal":false,"person":{"id":"580cd72a-2d00-44dd-b608-a8b8a32d0cd7","name":"Guest","isExternal":false,"orgId":"7426d9b4-7859-4134-9371-8fe2fa13f9c3","incomingCallProtocols":[]},"devices":[],"status":{"audioStatus":"INACTIVE","videoStatus":"INACTIVE","csis":[]},"controls":{"role":{"presenter":false,"roles":[{"type":"MODERATOR","hasRole":false,"meta":{"lastModified":"2022-01-26T22:43:51.988Z"}},{"type":"PRESENTER","hasRole":false,"meta":{"lastModified":"2022-01-26T22:43:52.215Z"}}]}},"doesNotSupportBreakouts":true,"id":"73f5e1f8-b807-319c-b95d-4598d7ee6a80","guest":false,"resourceGuest":false,"moderator":false,"panelist":false,"moveToLobbyNotAllowed":true},"id":"73f5e1f8-b807-319c-b95d-4598d7ee6a80","name":"Guest","isAudioMuted":false,"isVideoMuted":null,"isSelf":false,"isHost":false,"isGuest":false,"isInLobby":true,"isInMeeting":false,"isNotAdmitted":false,"isContentSharing":false,"status":"NOT_IN_MEETING","isDevice":false,"isUser":true,"associatedUser":null,"isRecording":false,"isMutable":false,"isRemovable":false,"type":"MEETING","isModerator":false},{"namespace":"Meetings","participant":{"isCreator":false,"identity":"fb4d160d-048f-4e6a-95bb-3e0446e173f8","url":"https://locus-b.wbx2.com/locus/api/v1/loci/7f501849-ebdd-3a7…429a79a7c44/participant/a7e3a4bf-b633-3174-b978-1df28a4937b7","state":"JOINED","type":"USER","isSiteInternal":false,"person":{"id":"fb4d160d-048f-4e6a-95bb-3e0446e173f8","name":"Guest","isExternal":false,"orgId":"7426d9b4-7859-4134-9371-8fe2fa13f9c3","incomingCallProtocols":[]},"devices":[{"url":"https://wdm-a.wbx2.com/wdm/api/v1/devices/e1e9fd9a-724a-4240-a3ea-ed8448986109","deviceType":"WEB","state":"JOINED","intents":[null],"correlationId":"df17ffd7-5a28-4b4e-88d6-3022cd1d01a2","isVideoCallback":false,"csis":[879033856,879033857,3415933185,3415933184],"replaces":[]}],"status":{"audioStatus":"SENDRECV","videoStatus":"SENDRECV","videoSlidesStatus":"INACTIVE","audioSlidesStatus":"INACTIVE","csis":[879033856,879033857,3415933185,3415933184]},"controls":{"audio":{"muted":false,"requestedToUnmute":false,"localAudioUnmuteRequired":false,"disallowUnmute":false,"meta":{}},"video":{"muted":false,"meta":{}},"layouts":[{"type":"ActivePresence","deviceUrl":"https://wdm-a.wbx2.com/wdm/api/v1/devices/e1e9fd9a-724a-4240-a3ea-ed8448986109"}],"role":{"presenter":true,"roles":[{"type":"MODERATOR","hasRole":false,"meta":{"lastModified":"2022-01-26T23:13:56.596Z"}},{"type":"PRESENTER","hasRole":true,"meta":{"lastModified":"2022-01-26T23:13:43.144Z"}}]}},"doesNotSupportBreakouts":true,"id":"a7e3a4bf-b633-3174-b978-1df28a4937b7","guest":false,"resourceGuest":false,"moderator":false,"panelist":false,"moveToLobbyNotAllowed":true,"deviceUrl":"https://wdm-a.wbx2.com/wdm/api/v1/devices/e1e9fd9a-724a-4240-a3ea-ed8448986109"},"id":"a7e3a4bf-b633-3174-b978-1df28a4937b7","name":"Guest","isAudioMuted":false,"isVideoMuted":false,"isSelf":false,"isHost":false,"isGuest":false,"isInLobby":false,"isInMeeting":true,"isNotAdmitted":false,"isContentSharing":false,"status":"IN_MEETING","isDevice":false,"isUser":true,"associatedUser":null,"isRecording":false,"isMutable":false,"isRemovable":true,"type":"MEETING","isModerator":false}, 
    {"namespace":"Meetings","participant":{"isCreator":false,"identity":"d80cd72a-2d00-44dd-b608-a8b8a32d0cd7",
        "url":"https://locus-b.wbx2.com/locus/api/v1/loci/7f501849-ebdd-3a7…429a79a7c44/participant/73f5e1f8-b807-319c-b95d-4598d7ee6a80","state":"LEFT","reason":
        "INACTIVE","type":"USER","isSiteInternal":false,"person":{"id":"d80cd72a-2d00-44dd-b608-a8b8a32d0cd7","name":"Guest","isExternal":false,
            "orgId":"7426d9b4-7859-4134-9371-8fe2fa13f9c3","incomingCallProtocols":[]},"devices":[],"status":{"audioStatus":"INACTIVE","videoStatus":
                "INACTIVE","csis":[]},"controls":{"role":{"presenter":false,"roles":[{"type":"MODERATOR","hasRole":false,"meta":{"lastModified":"2022-01-26T22:43:51.988Z"}},
                    {"type":"PRESENTER","hasRole":false,"meta":{"lastModified":"2022-01-26T22:43:52.215Z"}}]}},"doesNotSupportBreakouts":true,
                        "id":"d3f5e1f8-b807-319c-b95d-4598d7ee6a80","guest":false,"resourceGuest":false,"moderator":false,"panelist":false,"moveToLobbyNotAllowed":true},
                        "id":"d3f5e1f8-b807-319c-b95d-4598d7ee6a80","name":"Guest","isAudioMuted":false,"isVideoMuted":null,"isSelf":false,"isHost":false,"isGuest":false,
                        "isInLobby":true,"isInMeeting":false,"isNotAdmitted":false,"isContentSharing":false,"status":"NOT_IN_MEETING","isDevice":false,"isUser":true,"associatedUser":null,"isRecording":false,"isMutable":false,"isRemovable":false,"type":"MEETING","isModerator":false},{"namespace":"Meetings","participant":{"isCreator":false,"identity":"fb4d160d-048f-4e6a-95bb-3e0446e173f8","url":"https://locus-b.wbx2.com/locus/api/v1/loci/7f501849-ebdd-3a7…429a79a7c44/participant/a7e3a4bf-b633-3174-b978-1df28a4937b7","state":"JOINED","type":"USER","isSiteInternal":false,"person":{"id":"fb4d160d-048f-4e6a-95bb-3e0446e173f8","name":"Guest","isExternal":false,"orgId":"7426d9b4-7859-4134-9371-8fe2fa13f9c3","incomingCallProtocols":[]},"devices":[{"url":"https://wdm-a.wbx2.com/wdm/api/v1/devices/e1e9fd9a-724a-4240-a3ea-ed8448986109","deviceType":"WEB","state":"JOINED","intents":[null],"correlationId":"df17ffd7-5a28-4b4e-88d6-3022cd1d01a2","isVideoCallback":false,"csis":[879033856,879033857,3415933185,3415933184],"replaces":[]}],"status":{"audioStatus":"SENDRECV","videoStatus":"SENDRECV","videoSlidesStatus":"INACTIVE","audioSlidesStatus":"INACTIVE","csis":[879033856,879033857,3415933185,3415933184]},"controls":{"audio":{"muted":false,"requestedToUnmute":false,"localAudioUnmuteRequired":false,"disallowUnmute":false,"meta":{}},"video":{"muted":false,"meta":{}},"layouts":[{"type":"ActivePresence","deviceUrl":"https://wdm-a.wbx2.com/wdm/api/v1/devices/e1e9fd9a-724a-4240-a3ea-ed8448986109"}],"role":{"presenter":true,"roles":[{"type":"MODERATOR","hasRole":false,"meta":{"lastModified":"2022-01-26T23:13:56.596Z"}},{"type":"PRESENTER","hasRole":true,"meta":{"lastModified":"2022-01-26T23:13:43.144Z"}}]}},"doesNotSupportBreakouts":true,"id":"a7e3a4bf-b633-3174-b978-1df28a4937b7","guest":false,"resourceGuest":false,"moderator":false,"panelist":false,"moveToLobbyNotAllowed":true,"deviceUrl":"https://wdm-a.wbx2.com/wdm/api/v1/devices/e1e9fd9a-724a-4240-a3ea-ed8448986109"},"id":"a7e3a4bf-b633-3174-b978-1df28a4937b7","name":"Guest","isAudioMuted":false,"isVideoMuted":false,"isSelf":false,"isHost":false,"isGuest":false,"isInLobby":false,"isInMeeting":true,"isNotAdmitted":false,"isContentSharing":false,"status":"IN_MEETING","isDevice":false,"isUser":true,"associatedUser":null,"isRecording":false,"isMutable":false,"isRemovable":true,"type":"MEETING","isModerator":false}]}
                        */
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
      //TODO: put this back!
      if(myself.isModerator){
        //if(true){
        memberOption = $(`<img id="${user.id}" src="images/icons/enter-room_16_w.png" class="member_option member_admit_icon">`);
        member.prepend(
          $('<div>').append(memberOption
            .on('click', function(e){
              console.log('click');
              console.log(this.id);
              meeting.admit([this.id]);//TODO: Put this back!
            }))
        );
      }
      $('#lobby-members').append(member);
    } else if(user.isInMeeting) {
      if(user.isAudioMuted){
        memberOption = $('<img src="images/icons/microphone-muted_16_w.png" class="member_option member_mute_icon">');
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

//TODO: comment this out!
//updateMeetingMembers();

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
  $("#remote-view-share").show();
}

function hideVideoElements(){
  $("#self-view").hide();
  $("#self-share").hide();
  $("#remote-view-video").hide();
  $("#remote-view-share").hide();
}

function resetShareIcon(){
  $("#screen_share_off").show();
  $("#screen_share_on").hide();
  $("#screen_share").removeClass("md-button--red");
  $("#screen_share").addClass("md-button--grey");
}

function resetAudioIcon(){
  $("#audio_mute_off").show();
  $("#audio_mute_on").hide();
  $("#audio_mute").removeClass("md-button--red");
  $("#audio_mute").addClass("md-button--grey");
}

function resetVideoIcon(){
  $("#video_mute_off").show();
  $("#video_mute_on").hide();
  $("#video_mute").removeClass("md-button--red");
  $("#video_mute").addClass("md-button--grey");
}

function resetLobbyIcon(){
  $('#people-button').removeClass('md-button--blue');
  $("#people-button-list").show();
  $("#people-button-wait").hide();
}

function clearPeopleFlash(){
  $('#people-button').removeClass('flash');
}

function showLobbyWaitingIcon(){
  console.log('showLobbyWaiting');
  $('#people-button_div').show();
  //$('#people-button').addClass('flash');
  //if(!flashTimeout){flashTimeout = setTimeout(clearPeopleFlash, 3000)}
  $('#people-button').addClass('md-button--blue');
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
  $("#sms_div").hide();
}

function showStartButtons(){
  $("#call_div").show();
  if(showSMS){
    $("#sms_div").show();
  } else if(listenOnlyOption) {
    $("#call_listen_div").show();
  }
}

function resetParticipantList(){
  $('#people-button_div').hide();
  $('#people').hide();
  $('#lobby-members').empty();
  $('#meeting-members').empty();
}

function resetControls(){
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
  showVideoElements();
  meeting.addMedia({localShare, localStream, mediaSettings});
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
  });
}

function addMedia(meeting){
  if(listenOnly === true){
    if(meeting.state == "JOINED"){
      meeting.addMedia({mediaSettings});
    } else {
      console.log('**Not joined, waiting for admission event.');
    }
  } else {
    // Get our local media stream and add it to the meeting
    return meeting.getMediaStreams(mediaSettings,{audio:true, video:true}).then(mediaStreams => {
      const [localStream, localShare] = mediaStreams;
      if(meeting.state == "JOINED"){
        addMediaFunction(meeting, localStream, localShare);
      } else {
        console.log('**Not joined, waiting for admission event.');
      }
    });
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
  event.preventDefault();
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


async function smsButtonFunction(event){
  let root = 'licensed-sms';
  if(window.location.pathname.indexOf(root) >= 0){
    let link = window.location.toString();
    let path = window.location.pathname.split(root)[0];
    smsFunction(link.replace(root, 'guest'), path);
  } else {
    let guestUrl = await create_url();
    console.log(guestUrl);
    smsFunction(guestUrl, deployUrl);
  }
}

document.getElementById("call").addEventListener("click", callButtonFunction);
document.getElementById("call-listen").addEventListener("click", callButtonListenFunction);
document.getElementById("sms").addEventListener("click", smsButtonFunction);
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
