var context, analyser, src, array, gainNode, fps;

const container1 = document.getElementById('c1');
const container2 = document.getElementById('c2');
const audio = document.querySelector('audio');
const fpsEl = document.getElementById('fps_drops');

// window.onclick = function() {
//     if (!context) {
//         preparation();
//     }

//     if (audio.paused) {
//         audio.play();
//         loop();
//     } else {
//         audio.pause();
//     }
// }

const rAmount = 60;
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
    src
        .connect(analyser)
        .connect(gainNode)
        .connect(context.destination);

    gainNode.gain.value = 0.5;

    loop();
}

const maxHeight = Math.floor(innerHeight / 2);
const maxInt = 255;
const heightOffset = maxHeight / maxInt;

var lastloop = new Date();
var fps_arr = new Array(50);

function loop() {
    let thisloop = new Date();
    fps = Math.floor(1000 / (thisloop - lastloop));
    lastloop = thisloop;

    if (typeof fps_arr[fps_arr.length - 1] != 'undefined') fps_arr.shift();
    fps_arr.push(fps);

    let fps_sum = 0;
    fps_arr.forEach(num => {
        fps_sum += num;
    });

    fpsEl.innerHTML = Math.floor(fps_sum / fps_arr.length);

    array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);

    for (let i = 0; i < mainRectangles.length; i++) {
        // Last elements seems not changes a lot
        // and because of it let's decrease step by 5
        let curr_i = i * Math.floor(array.length / mainRectangles.length - 5);
        let curr_height = Math.floor(array[curr_i] * heightOffset);

        let mRectStyle = mainRectangles[i].rect.style;
        let mrrRectStyle = mirrorRectangles[i].rect.style;
        
        mRectStyle.height = mrrRectStyle.height = `${curr_height}px`;
    }

    if (!audio.paused) {
        window.requestAnimationFrame(loop);
    }
}