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
  meeting.on("error", err => {
    console.error("Meeting error -", err);
  });
  
  meeting.on('meeting:locked', () => {
    //document.getElementById('meeting-lock').innerHTML = 'Meeting is Locked';
    console.error("Meeting locked");
  });
  
  meeting.on('meeting:unlocked', () => {
    //document.getElementById('meeting-lock').innerHTML = 'Meeting is Locked';
    console.error("Meeting unlocked -");
  });
  
  meeting.on('meeting:self:lobbyWaiting', () => {
    //document.getElementById('lobby-space').innerHTML = 'User is guest to space, waiting to be admitted, wait to use addMedia';
    console.log('User is guest to space, waiting to be admitted, wait to use addMedia');
  });

  meeting.on('meeting:self:guestAdmitted', () => {
    //document.getElementById('lobby-space').innerHTML = 'Admitted to meeting as guest to call.';
    console.log('Admitted to meeting as guest to call');
  });

//meeting:self:lobbyWaiting

  // Handle media streams changes to ready state
  meeting.on("media:ready", media => {
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
    meeting.leave();
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
