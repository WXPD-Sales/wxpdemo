//const webex = window.Webex.init();
const webex = (window.webex = Webex.init({
  logger: {
    level: "degug"
  }
}));

const myAccessToken =
  "OTQ3NjJjMWEtNjRmOS00ZjM3LTllZWItYWM3MGZjMzM3MmE1YmYxYjc2NGEtZTY0_PF84_35a15b0a-0ef1-4029-9f63-a7c54df5df59";

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



webex.once("ready", () => {
  console.log("webex obj ready");
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
    console.error(err);
  });

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
      //console.log(`meeting object => ${meeting}`);
      // Call our helper function for binding events to meetings
      bindMeetingEvents(meeting);

      return joinMeeting(meeting);
    })
    .catch(error => {
      // Report the error
      console.error(error);
    });
});
