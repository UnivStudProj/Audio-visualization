const customField = document.getElementsByClassName('custom-field');
const inputEl = document.querySelector('input');
const sendButton = document.getElementById('sendButton');
const placeHolder = document.getElementsByClassName('placeholder');

sendButton.addEventListener('click', sendEvent);

// hiding input and send button after pressing it
function elementsApperance(mode, ...elements) {
    var el_opacity, el_visibility;

    if (mode == 'hide') {
        el_opacity = 0;
        el_visibility = 'hidden';
    } else if (mode == 'show') {
        el_opacity = 1;
        el_visibility = 'visible';
    }

    elements.forEach(element => {
        element.style.opacity = el_opacity;
        element.style.visibility = el_visibility;
    }); 
}

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
        audio.src = msg.text;
    }
}