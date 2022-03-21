var context, analyser, src, array;

const container1 = document.getElementById('c1');
const container2 = document.getElementById('c2');
const audio = document.querySelector('audio');

window.onclick = function() {
    if (!context) {
        preparation();
    }

    if (audio.paused) {
        audio.play();
        loop();
    } else {
        audio.pause();
    }
}

const rectangles1 = new Array(60);
const rectangles2 = new Array(60);

for (let i = 0; i < rectangles1.length; i++) {
    let rect1 = document.createElement('div');
    rect1.className = 'rectangle rectangle--hidden';
    container1.appendChild(rect1);
    rectangles1[i] = rect1;

    let rect2 = document.createElement('div');
    rect2.className = 'rectangle rectangle--shadow rectangle--hidden';
    container2.appendChild(rect2);
    rectangles2[i] = rect2;
}


function preparation() {
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(context.destination);

    let gainNode = context.createGain();
    gainNode.gain.value = 0.1;
    gainNode.connect(context.destination);
    loop();
}

function loop() {
    if (!audio.paused) {
        window.requestAnimationFrame(loop);
    }

    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    for (let i = 0; i < rectangles1.length; i++) {
        rectangles1[i].style.height = array[i];
        rectangles2[i].style.height = array[i];
    }
}