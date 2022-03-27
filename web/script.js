const container1 = document.getElementById('c1');
const container2 = document.getElementById('c2');
const audio = document.querySelector('audio');
const performanceEl = document.getElementById('performance');

const playButton = document.getElementById('playButton');
const stopButton = document.getElementById('stopButton');

playButton.addEventListener('click', playAudio);
stopButton.addEventListener('click', stopAudio);
audio.addEventListener('ended', resetAudio);

// reseting height of the rectangles
function resetHeight() {
    return new Promise(resolve => {
        setTimeout(() => { 
            for (let i = 0; i < mainRectangles.length; i++) {
                mainRectangles[i].rect.style.height = mirrorRectangles[i].rect.style.height = '2px';
            }
            resolve('resolved');
        }, 10);
    })
}

// reseting elements to default state
async function resetAudio() {
    await resetHeight();
    playButton.src = 'materials/play.svg';
    calcTime();
};

// play button event
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

// stop button event
function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
    resetAudio();
}

const rectAmount = 60;
const rectMargins = 2 * 2; // margin-left + margin-right in px (distance between rectangles) 
const widthMargins = 240 * 2;
const rectWidth = ((innerWidth - widthMargins) / rectAmount) - rectMargins;

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
        this.rect.style.width = `${rectWidth}px`;
        this.container.appendChild(this.rect);
    }
}

const mainRectangles = new Array(rectAmount);
const mirrorRectangles = new Array(rectAmount);

// creating 2 types of rectangles
for (let i = 0; i < rectAmount; i++) {
    let mRect = new CustomRect('rectangle', container1);
    mainRectangles[i] = mRect;

    let mrrRect = new CustomRect('rectangle rectangle--mirror', container2);
    mirrorRectangles[i] = mrrRect;
}

var context, analyser;

// creating necessary interfaces
function preparation() {
    context = new AudioContext();
    analyser = context.createAnalyser();
    const gainNode = context.createGain();
    const src = context.createMediaElementSource(audio);
    src.connect(analyser).connect(gainNode).connect(context.destination);

    gainNode.gain.value = 0.5;
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    loop();
}

var fps_arr = new Array(50);
var latency_arr = new Array(50);
var last_loop = new Date();

// calculating average fps and latency
function calcPerformance() {

    // current fps and latency
    let this_loop = new Date();
    let this_latency = this_loop - last_loop;
    let fps = Math.floor(1000 / (this_latency));
    last_loop = this_loop;

    // removing first value when arrays are full
    if (typeof fps_arr[fps_arr.length - 1] != 'undefined') {
        fps_arr.shift();
        latency_arr.shift();
    }

    // adding new values to the arrays
    fps_arr.push(fps);
    latency_arr.push(this_latency);

    // calculating sum both of arrays
    var fps_sum = latency_sum = 0;
    for (let i = 0; i < fps_arr.length; i++) {
        fps_sum += fps_arr[i];
        latency_sum += latency_arr[i];
    }

    // calculating average both of arrays
    let fps_avg = Math.floor(fps_sum / fps_arr.length);
    let latency_avg = Math.floor(latency_sum / latency_arr.length);

    // writting the result in the corresponding element
    performanceEl.innerHTML = `${fps_avg}fps&emsp;${latency_avg}ms`;
}

// calculating the rest of time
function calcTime() {
    let TimeLeft = audio.duration - Math.floor(audio.currentTime);
    let MinutesLeft = Math.floor(TimeLeft / 60);
    let SecondsLeft = Math.floor(TimeLeft % 60);

    if (MinutesLeft < 10) MinutesLeft = '0' + MinutesLeft;
    if (SecondsLeft < 10) SecondsLeft = '0' + SecondsLeft;

    audioTime.innerHTML = `${MinutesLeft}:${SecondsLeft}`;
}

const maxHeight = Math.floor(innerHeight / 2);
const maxInt = 255;
const heightOffset = maxHeight / maxInt;

// calculating the height of the rectangles
function calcHeight() {
    let int8_arr = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(int8_arr);

    for (let i = 0; i < mainRectangles.length; i++) {
        let curr_i = Math.floor(i * (int8_arr.length / mainRectangles.length));
        mainRectangles[i].rect.style.height = `${int8_arr[curr_i] * heightOffset}px`;
        mirrorRectangles[i].rect.style.height = `${int8_arr[curr_i] * heightOffset}px`;
    }
}

// animation loop
function loop() {
    calcPerformance();
    calcTime();
    calcHeight();

    if (!audio.paused) {
        window.requestAnimationFrame(loop);
    }
}
