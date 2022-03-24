const customField = document.getElementsByClassName('custom-field');
const inputEl = document.querySelector('input');
const sendButton = document.getElementById('sendButton');
const placeHolder = document.getElementsByClassName('placeholder');

sendButton.addEventListener('click', sendEvent);

function sendEvent() {
    sendButton.removeEventListener('click', sendEvent);
    let url = inputEl.value;
    console.log(url);

    inputEl.style.opacity = 0;
    sendButton.style.opacity = 0;
    placeHolder[0].style.opacity = 0;
    
    inputEl.style.visibility = 'hidden';
    sendButton.style.visibility = 'hidden';
    placeHolder[0].style.visibility = 'hidden';

}