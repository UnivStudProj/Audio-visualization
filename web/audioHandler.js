const customField = document.getElementsByClassName('custom-field');
const inputEl = document.querySelector('input');
const sendButton = document.getElementById('sendButton');
const placeHolder = document.getElementsByClassName('placeholder');

const audiothumb = document.getElementById('audio-thumbnail');
const audiotitle = document.getElementById('audio-title');
const audioTime = document.getElementById('audio-time');

sendButton.addEventListener('click', sendEvent);
stopButton.addEventListener('click', stopAudio);
audio.addEventListener('ended', resetAudio);

function wait() {
    return new Promise(resolve => {
        setTimeout(() => { 
            for (let i = 0; i < mainRectangles.length; i++) {
                mainRectangles[i].rect.style.height = mirrorRectangles[i].rect.style.height = '2px';
            }
            resolve('resolved');
        }, 10);
    })
}

async function resetAudio() {
    await wait();
    elementsApperance('show', inputEl, sendButton, placeHolder[0])
    playButton.src = 'materials/play.svg';
};

function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
    resetAudio();
}

// hiding input and send button after pressing it
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

callPython('https://www.youtube.com/watch?v=vjWwR5FGj1k');

// Button click
function sendEvent() {
    sendButton.removeEventListener('click', sendEvent);
    elementsApperance('hide', inputEl, sendButton, placeHolder[0]);

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
        audiothumb.src = msg.thumbnail;
        audiotitle.innerHTML = msg.title;
        audioTime.innerHTML = msg.duration;
    }
}