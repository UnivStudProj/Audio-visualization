const inputEl = document.querySelector('input');
const sendButton = document.getElementById('sendButton');
const placeHolder = document.getElementsByClassName('placeholder');

const audioInfo = document.getElementsByClassName('audio-info')[0];
const audioThumb = document.getElementById('audio-thumbnail');
const audioTitle = document.getElementById('audio-title');
const audioTime = document.getElementById('audio-time');

sendButton.addEventListener('click', sendEvent);

callPython('https://www.youtube.com/watch?v=_TTKMO1b7bM');

// Button click
function sendEvent() {
    if (!audio.paused) audio.pause();
    audioInfo.style.opacity = 0;
    resetAudio();

    callPython(inputEl.value);
    inputEl.value = '';
}

// Sending the url to the Python
async function callPython(url) {
    await eel.fromJS(url);
}

// Receiving from the Python
eel.expose(toJS);
function toJS(msg) {
    if (msg.type == 'error') {
        alert(msg.text);
    } else {
        audio.crossOrigin = 'anonymous';
        audio.src = msg.url;
        audioThumb.src = msg.thumbnail;
        audioTitle.innerHTML = msg.title;
        audioTime.innerHTML = msg.duration.substring(3);
    }
    audioInfo.style.opacity = 1;
}