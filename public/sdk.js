
let credentials = {
  logger: {
    level: "debug"
  }
};

const userType = Cookies.get("type");
const destination = Cookies.get("target");
let jwt;
let userToken;
console.log(userType);
if(userType == "employee"){
  $('#main-title').text("Webex Employee Access");
  userToken = Cookies.get("token");
  console.log(`Found userToken - ${userToken}`);
  credentials.credentials = { access_token: userToken };
} else {
  jwt = Cookies.get("token");
  console.log(`Found JWT - ${jwt}`);
}

const webex = (window.webex = Webex.init(credentials));

//-----
//AV Sources

const audioInputSelect = document.querySelector('select#audioSource');
//const audioOutputSelect = document.querySelector('select#audioOutput');
const videoSelect = document.querySelector('select#videoSource');

const audio = {};
const video = {};
const mediaSettings = {
  receiveVideo: true,
  receiveAudio: true,
  receiveShare: false,
  sendShare: false,
  sendVideo: true,
  sendAudio: true
};

// setting up the devices
const selectors = [audioInputSelect, /*audioOutputSelect,*/ videoSelect];

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

  option.value = deviceInfo.deviceId;
  if (deviceInfo.kind === 'audioinput') {
    option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
    audioInputSelect.appendChild(option);
  }
  /*
  else if (deviceInfo.kind === 'audiooutput') {
    option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
    audioOutputSelect.appendChild(option);
  }*/
  else if (deviceInfo.kind === 'videoinput') {
    option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
    videoSelect.appendChild(option);
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



let m;

webex.once("ready", () => {
  console.log(`Webex OBJ ready ${webex.version}`);
  if(jwt != null){
    webex.authorization
      .requestAccessTokenFromJwt({jwt})
      .then(finalizeWebexAuth)
      .catch(e => {
        // Do something with the auth error here
        console.error(e);
      });
  } else {
    finalizeWebexAuth(null);
  }

});

function finalizeWebexAuth(data){
  if (webex.canAuthorize) {
    // Authorization is successful
    // your app logic goes here
    // Change Authentication status to `Authenticated`
    console.log("User Authenticated");
    console.log(`Data - ${JSON.stringify(webex)}`);

    webex.meetings.register().catch(err => {
      console.error(err);
      alert(err);
      throw err;
    });
  }
}

function bindMeetingEvents(meeting) {

  console.log('This meeting', meeting);

  //meeting.setMeetingQuality('HIGH');


  meeting.on('media:ready', (payload) => {
    console.log('media:ready', payload);
  });

  meeting.on('media:stopped', (payload) => {
    console.log('media:stopped', payload);
  });

  meeting.on('media:update', (payload) => {
    console.log('media:update', payload);
  });


  meeting.on("error", err => {
    console.error("Meeting error -", err);
  });

  //meeting:stateChange

  meeting.on('meeting:stateChange', (payload) => {
    //document.getElementById('log').innerHTML = `${payload}`;
    //setTimeout(() => { document.getElementById('log').innerHTML = ''; }, 5000);
    console.log("Meeting State Change", payload);
    /*
    if(payload.currentState === "ACTIVE"){
      meeting.mediaProperties.mediaSettings.audio.echoCancellation=false;
      meeting.mediaProperties.mediaSettings.audio.noiseSuppression=false;
    }*/
  });

  meeting.on('meeting:ringing', (payload) => {
    document.getElementById('log').innerHTML = 'Ringing';
    setTimeout(() => { document.getElementById('log').innerHTML = ''; }, 5000);
    console.log("Meeting Ringing", payload);
  });

  meeting.on('meeting:ringingStop', (payload) => {
    document.getElementById('log').innerHTML = 'Ringing Stop';
    //setTimeout(() => { document.getElementById('log').innerHTML = ''; }, 5000);
    console.log("Meeting Ringing Stop", payload);
  });

  meeting.on('meeting:added', (payload) => {
    document.getElementById('log').innerHTML = 'Meeting Added';
    //setTimeout(() => { document.getElementById('log').innerHTML = ''; }, 5000);
    console.log("meeting:added", payload);
  });

  meeting.on('meeting:removed', (payload) => {
    document.getElementById('log').innerHTML = 'Meeting Removed';
    //setTimeout(() => { document.getElementById('log').innerHTML = ''; }, 5000);
    console.log("meeting:removed", payload);
  });

  meeting.on('meeting:locked', () => {
    document.getElementById('log').innerHTML = 'Meeting is Locked';
    console.error("Meeting locked");
  });

  meeting.on('meeting:unlocked', () => {
    document.getElementById('log').innerHTML = 'Meeting is UnLocked';
    console.error("Meeting unlocked");
  });

  meeting.on('meeting:self:lobbyWaiting', () => {
    document.getElementById('log').innerHTML = 'Waiting in lobby';
    //document.getElementById('lobby-space').innerHTML = 'User is guest to space, waiting to be admitted, wait to use addMedia';
    console.log('User is guest to space, waiting to be admitted, wait to use addMedia');
  });

  meeting.on('meeting:actionsUpdate', (payload) => {
    console.log(`meeting:actionsUpdate - ${JSON.stringify(payload)}`);
  });

  meeting.on('meeting:reconnectionStarting', () => {
    document.getElementById('log').innerHTML = 'Reconnecting...';
  });

  meeting.on('meeting:reconnectionSuccess', () => {
    document.getElementById('log').innerHTML = 'Reconnected';
    setTimeout(() => { document.getElementById('log').innerHTML = ''; }, 5000);
  });

  meeting.on('meeting:reconnectionFailure', () => {
    document.getElementById('log').innerHTML = 'reconnection failure';
  });

  meeting.on('meeting:self:guestAdmitted', () => {
    document.getElementById('log').innerHTML = 'Admitted to meeting as guest';
    console.log('Admitted to meeting as guest to call');
    return joinMeeting(meeting);
  });

  meeting.on('meeting:self:mutedByOthers', () => {
    document.getElementById('log').innerHTML = 'Muted by others';
    setTimeout(() => {
      document.getElementById('log').innerHTML = '';
    }, 10000);
  });

  // Handle media streams changes to ready state
  meeting.on("media:ready", media => {
    console.log('media:ready', media);
    if (!media) {
      return;
    }
    if (media.type === "local") {
      document.getElementById("self-view").srcObject = media.stream;
    }
    if (media.type === "remoteVideo") {
      document.getElementById("remote-view-video").srcObject = media.stream;
    }
    if (media.type === "remoteAudio") {
      document.getElementById("remote-view-audio").srcObject = media.stream;
    }
  });

  // Handle media streams stopping
  meeting.on("media:stopped", media => {
    console.log('media:stopped', media);
    // Remove media streams
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

 // Toggle audio mute in the meeting:
  document.getElementById("audio_mute").addEventListener("click", () => {
    console.log('TOGGLE MUTE');
    meeting.isAudioMuted() ? meeting.unmuteAudio() : meeting.muteAudio();
  });

  // Of course, we'd also like to be able to leave the meeting:
  document.getElementById("hangup").addEventListener("click", () => {
    document.getElementById("self-view").srcObject = null;
    document.getElementById("remote-view-video").srcObject = null;
    document.getElementById("remote-view-audio").srcObject = null;
    meeting.leave(meeting.id);
  });
}

// Join the meeting and add media
function joinMeeting(meeting) {
  return meeting.join().then(() => {

    // Get our local media stream and add it to the meeting
    return meeting.getMediaStreams(mediaSettings,{audio:true, video:true}).then(mediaStreams => {
      //console.log('Here are the mediaStreams',mediaStreams);
      const [localStream, localShare] = mediaStreams;

      meeting.addMedia({
        localShare,
        localStream,
        mediaSettings
      });
      console.log(meeting.getDevices().then(devices => {
        for(var i in devices){
          let selector = "audioSource";
          if(devices[i].kind == "videoinput"){
            selector = "videoSource";
          }
          $(`#${selector} option[value="${devices[i].deviceId}"]`).text(devices[i].label);
        }
        $("#v_select").show();
        $("#a_select").show();
        $("#video_mute").show();
        $("#audio_mute").show();
      }));
    });
  });
}

document.getElementById("call").addEventListener("click", event => {
  // again, we don't want to reload when we try to join
  event.preventDefault();

  //const destination = document.getElementById("invitee").value;
  // document.getElementById("welcome_message").style.display="none";
  console.log(`got destination - ${destination}`);

  // attaching before the request

  audio.deviceId = {exact: audioInputSelect.value};
  audio.noiseSuppression=false;
  audio.echoCancellation=true;
  video.deviceId = {exact: videoSelect.value};

  return webex.meetings
    .create(destination)
    .then(meeting => {
      //m = meeting;
      //meeting.mediaProperties.mediaSettings.audio.echoCancellation=false;
      //meeting.mediaProperties.mediaSettings.audio.noiseSuppression=false;
      //console.log(`meeting object ${JSON.stringify(meeting)}`);
      // Call our helper function for binding events to meetings
      bindMeetingEvents(meeting);

      return joinMeeting(meeting);
    })
    .catch(error => {
      // Report the error
      console.error(error);
    });
});
