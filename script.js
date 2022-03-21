var context, analyser, src, array, gainNode;

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

const w = innerWidth;
const rAmount = 60;
const rMargins = 2; // left + right in px
const rWidth = w / rAmount - rMargins;

class CustomRect {
    constructor(className, container) {
        this.className =  className;
        this.container = container;
        this.rect = null;
        this.#rCrate();
    }

    #rCrate() {
        this.rect = document.createElement('div');
        this.rect.className = this.className;
        this.rect.style.marginLeft = this.rect.style.marginRight = `${rMargins / 2}px`;
        this.rect.style.width = `${rWidth}px`;
        this.container.appendChild(this.rect);
    }
}

const mainRectangles = new Array(rAmount);
const shadowRectangles = new Array(rAmount);

for (let i = 0; i < rAmount; i++) {
    let mRect = new CustomRect('rectangle', container1);
    mainRectangles[i] = mRect;

    let sRect = new CustomRect('rectangle rectangle--shadow', container2);
    shadowRectangles[i] = sRect;
}


function preparation() {
    context = new AudioContext();
    analyser = context.createAnalyser();
    src = context.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(context.destination);

    loop();
}

const maxHeight = Math.floor(innerHeight / 2);
const maxInt = 255;
const heightOffset = maxHeight / maxInt;

function loop() {
    if (!audio.paused) {
        window.requestAnimationFrame(loop);
    }

    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    for (let i = 0; i < mainRectangles.length; i++) {
        // Last elements seems not changes a lot
        // and because of it let's decrease step by 5
        let curr_i = Math.floor(i * (array.length / mainRectangles.length - 5));
        let curr_height = array[curr_i] * heightOffset;
        mainRectangles[i].rect.style.height = `${curr_height}px`;
        shadowRectangles[i].rect.style.height = `${curr_height}px`;
    }
}