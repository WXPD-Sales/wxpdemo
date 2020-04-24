const myAccessToken = "MjMxN2U0N2MtNmY3Mi00ZDI5LWI0OGQtZDcwMjEzNGQ5ZDJjZjQ0NjE3NjUtOGZm_PF84_35a15b0a-0ef1-4029-9f63-a7c54df5df59";
//console.log(process.env.DEV_TOKEN);
/*
if (myAccessToken === "YOUR_ACCESS_TOKEN") {
  alert("Make sure to update your access token in the index.js file!");
  return;
}
*/
const webex = window.Webex.init({
  credentials: {
    access_token: myAccessToken
  }
});

webex.meetings.register().catch(err => {
  console.error(err);
  alert(err);
  throw err;
});

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

  const destination = document.getElementById("invitee").value;

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
