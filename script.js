var context, analyser, src, array;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
// const logo = document.getElementById('logo').style;
const audio = document.querySelector('audio');

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
var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;

window.onresize = function() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

const rectangles = new Array(50);
const offsideIndent = 20;       // indent from the screen sides
const insideIndent = 3;         // indent between rectangles
const property = {
    rMinHeight     : 10,
    rMaxHeight     : 100,
    rWidth         : (w - offsideIndent) / rectangles.length,
    rColor         : 'hsl(300, 100%, 95%)',
    rCount         : rectangles.length
}


class Rectangle {
    constructor(x, y, height, i) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.i = i;
    }

    rDraw() {
        ctx.fillStyle = property.rColor;
        if (this.i == rectangles.length - 1) ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, property.rWidth - insideIndent, this.height);
    }
}

var indent = offsideIndent / 2 + insideIndent / 2;
for (let i = 0; i < property.rCount; i++) {
    let x = indent;
    let y = h / 2;
    let rect = new Rectangle(x, y, property.rMinHeight, i);
    rectangles[i] = rect;
    indent += property.rWidth;
}

rectangles.forEach(rect => rect.rDraw());

// function preparation() {
//     context = new AudioContext();
//     analyser = context.createAnalyser();
//     src = context.createMediaElementSource(audio);
//     src.connect(analyser);
//     analyser.connect(context.destination);
//     loop();
// }

// function loop() {
//     if (!audio.paused) {
//         window.requestAnimationFrame(loop);
//     }

//     array = new Uint8Array(analyser.frequencyBinCount);
//     analyser.getByteFrequencyData(array);

//     logo.minHeight = (array[40]) + 'px';
//     logo.width = (array[40]) + 'px';
// }