const customField = document.getElementsByClassName('custom-field');
const inputEl = document.querySelector('input');
const sendButton = document.getElementById('sendButton');
const placeHolder = document.getElementsByClassName('placeholder');

sendButton.addEventListener('click', sendEvent);

// hiding input and send button after pressing it
function hideElements() {
    inputEl.style.opacity = 0;
    sendButton.style.opacity = 0;
    placeHolder[0].style.opacity = 0;
    
    inputEl.style.visibility = 'hidden';
    sendButton.style.visibility = 'hidden';
    placeHolder[0].style.visibility = 'hidden';
}

function sendEvent() {
    sendButton.removeEventListener('click', sendEvent);
    hideElements();

    let url = inputEl.value;
    callPython(url);

}

async function callPython(url) {
    await eel.fromJS(url);
}

eel.expose(toJS);
function toJS(test) {
    console.log(test);
}