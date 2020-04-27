//const webex = window.Webex.init();
const webex = (window.webex = Webex.init({
  logger: {
    level: "debug"
  }
}));

const destination = Cookies.get("target");
const jwt = Cookies.get("token");
console.log(`Found JWT - ${jwt}`);
/*

const webex = window.Webex.init({
  credentials: {
    access_token: myAccessToken
  }
});

*/

let m;

webex.once("ready", () => {
  console.log(`Webex OBJ ready ${webex.version}`);
  webex.authorization
    .requestAccessTokenFromJwt({jwt})
    .then((data) => {
      if (webex.canAuthorize) {
        // Authorization is successful
        // your app logic goes here
        // Change Authentication status to `Authenticated`
        console.log("Guest Authenticated");
        console.log(`Data - ${JSON.stringify(webex)}`);
        
        webex.meetings.register().catch(err => {
          console.error(err);
          alert(err);
          throw err;
        });
        
        
      }
    })
    .catch(e => {
      // Do something with the auth error here
      console.error(e);
    });
});

/*
webex.meetings.register().catch(err => {
  console.error(err);
  alert(err);
  throw err;
});
*/

function bindMeetingEvents(meeting) {
  
  console.log('This meeting', meeting);
  
  meeting.on("error", err => {
    console.error("Meeting error -", err);
  });
  
  //meeting:stateChange
  
  meeting.on('meeting:stateChange', (payload) => {
    //document.getElementById('log').innerHTML = `${payload}`;
    //setTimeout(() => { document.getElementById('log').innerHTML = ''; }, 5000);
    console.log("Meeting State Change", payload);
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

//meeting:self:lobbyWaiting

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

  // Of course, we'd also like to be able to leave the meeting:
  document.getElementById("hangup").addEventListener("click", () => {
    meeting.leave(meeting.id);
  });
}

// Join the meeting and add media
function joinMeeting(meeting) {
  return meeting.join().then(() => {
    const mediaSettings = {
      receiveVideo: true,
      receiveAudio: true,
      receiveShare: false,
      sendVideo: true,
      sendAudio: true,
      sendShare: false
    };

    // Get our local media stream and add it to the meeting
    return meeting.getMediaStreams(mediaSettings).then(mediaStreams => {
      console.log('Here are the mediaStreams',mediaStreams);
      const [localStream, localShare] = mediaStreams;

      meeting.addMedia({
        localShare,
        localStream,
        mediaSettings
      });
    });
  });
}

document.getElementById("destination").addEventListener("submit", event => {
  // again, we don't want to reload when we try to join
  event.preventDefault();

  //const destination = document.getElementById("invitee").value;
  document.getElementById("welcome_message").style.display="none";
  console.log(`got destination - ${destination}`);

  return webex.meetings
    .create(destination)
    .then(meeting => {
      m = meeting;
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
