const audioInputSelect = document.querySelector('select#audioSource');
const audioOutputSelect = document.querySelector('select#audioOutput');
const videoSelect = document.querySelector('select#videoSource');

const audio = {};
const video = {};
const media = {
  receiveVideo: true,
  receiveAudio: true,
  receiveShare: false,
  sendShare: false,
  sendVideo: true,
  sendAudio: true
};

// setting up the devices
const selectors = [audioInputSelect, audioOutputSelect, videoSelect];

navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
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
  else if (deviceInfo.kind === 'audiooutput') {
    option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
    audioOutputSelect.appendChild(option);
  }
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

// attaching before the request

audio.deviceId = {exact: audioInputSelect.value};
video.deviceId = {exact: videoSelect.value};
