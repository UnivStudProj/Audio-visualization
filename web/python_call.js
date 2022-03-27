const customField = document.getElementsByClassName('custom-field');
const inputEl = document.querySelector('input');
const sendButton = document.getElementById('sendButton');
const placeHolder = document.getElementsByClassName('placeholder');

const audioInfo = document.getElementsByClassName('audio-info')[0];
const audioThumb = document.getElementById('audio-thumbnail');
const audioTitle = document.getElementById('audio-title');
const audioTime = document.getElementById('audio-time');

sendButton.addEventListener('click', sendEvent);

// hiding input and send button
function elementsApperance(mode, ...elements) {
    var el_opacity, el_visibility;

    if (mode == 'hide') {
        el_opacity = 0;
        el_visibility = 'hidden';
    } else if (mode == 'show') {
        inputEl.value = '';
        el_opacity = 1;
        el_visibility = 'visible';
        sendButton.addEventListener('click', sendEvent);
    }

    elements.forEach(element => {
        element.style.opacity = el_opacity;
        element.style.visibility = el_visibility;
    }); 
}

callPython('https://www.youtube.com/watch?v=_TTKMO1b7bM');

// Button click
function sendEvent() {
    sendButton.removeEventListener('click', sendEvent);
    elementsApperance('hide', inputEl, sendButton, placeHolder[0]);
    audioInfo.style.opacity = 0;
    resetHeight();

    let url = inputEl.value;
    callPython(url);
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
        elementsApperance('show', inputEl, sendButton, placeHolder[0]);
        sendButton.addEventListener('click', sendEvent);
    } else {
        audio.crossOrigin = 'anonymous';
        audio.src = msg.url;
        audioThumb.src = msg.thumbnail;
        audioTitle.innerHTML = msg.title;
        audioTime.innerHTML = msg.duration.substring(3);
    }
    audioInfo.style.opacity = 1;
}