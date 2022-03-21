var context, analyser, src, array;

const container = document.getElementById('container');
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

const rectangles = new Array(60);

for (let i = 0; i < rectangles.length; i++) {
    let rect = document.createElement('div');
    rect.className = 'rectangle';
    container.appendChild(rect);
}


function preparation() {
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(context.destination);
    loop();
}

function loop() {
    if (!audio.paused) {
        window.requestAnimationFrame(loop);
    }

    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    for (let i = 0; i < rectangles.length; i++) {
        rectangles[i].style.height = array[i];
    }
}