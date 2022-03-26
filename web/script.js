var context, analyser, src, array, gainNode, fps;

const container1 = document.getElementById('c1');
const container2 = document.getElementById('c2');
const audio = document.querySelector('audio');
const performanceEl = document.getElementById('performance');

const playButton = document.getElementById('playButton');
const stopButton = document.getElementById('stopButton');

playButton.addEventListener('click', playAudio);

function playAudio() {
    if (!context) {
        preparation();
    }

    if (audio.paused) {
        audio.play();
        playButton.src = 'materials/pause.svg';
        loop();
    } else {
        audio.pause();
        playButton.src = 'materials/play.svg';
    }
}

const rAmount = 64;
const rMargins = 4; // margin-left + margin-right in px
const rWidth = innerWidth / rAmount - rMargins;

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
        this.rect.style.width = `${rWidth}px`;
        this.container.appendChild(this.rect);
    }
}

const mainRectangles = new Array(rAmount);
const mirrorRectangles = new Array(rAmount);

// creating 2 types of rectangles
for (let i = 0; i < rAmount; i++) {
    let mRect = new CustomRect('rectangle', container1);
    mainRectangles[i] = mRect;

    let mrrRect = new CustomRect('rectangle rectangle--mirror', container2);
    mirrorRectangles[i] = mrrRect;
}

function preparation() {
    context = new AudioContext();
    analyser = context.createAnalyser();
    gainNode = context.createGain();
    src = context.createMediaElementSource(audio);
    src.connect(analyser).connect(gainNode).connect(context.destination);

    gainNode.gain.value = 0.5;
    analyser.fftSize = rAmount * 2;
    analyser.smoothingTimeConstant = 0.8;

    loop();
}

const maxHeight = Math.floor(innerHeight / 2);
const maxInt = 255;
const heightOffset = maxHeight / maxInt;

var fps_arr = new Array(50);
var latency_arr = new Array(50);
var last_loop = new Date();

// calculating average fps and latency
function calcPerformance() {

    let this_loop = new Date();
    let this_latency = this_loop - last_loop;
    fps = Math.floor(1000 / (this_latency));
    last_loop = this_loop;

    if (typeof fps_arr[fps_arr.length - 1] != 'undefined') {
        fps_arr.shift();
        latency_arr.shift();
    }
    fps_arr.push(fps);
    latency_arr.push(this_latency);

    var fps_sum = latency_sum = 0;
    for (let i = 0; i < fps_arr.length; i++) {
        fps_sum += fps_arr[i];
        latency_sum += latency_arr[i];
    }

    let fps_avg = Math.floor(fps_sum / fps_arr.length);
    let latency_avg = Math.floor(latency_sum / latency_arr.length);

    performanceEl.innerHTML = `${fps_avg}fps&emsp;${latency_avg}ms`;
}

// animation loop
function loop() {
    calcPerformance();
    // changing height of the rectangles by frequency data analyser //

    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    for (let i = 0; i < mainRectangles.length; i++) {
        let curr_i = i * (array.length / mainRectangles.length);
        mainRectangles[i].rect.style.height = `${array[curr_i] * heightOffset}px`;
        mirrorRectangles[i].rect.style.height = `${array[curr_i] * heightOffset}px`;
    }

    if (!audio.paused) {
        window.requestAnimationFrame(loop);
    }
    //////////////////////////////////////////////////////////////////
}