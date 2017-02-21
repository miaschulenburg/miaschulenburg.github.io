var audiograb;
var fft;
var octaves;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    
    audiograb = new p5.AudioIn();
    audiograb.start()
    
    fft = new p5.FFT(0.9, 128);
    fft.setInput(audiograb);
    
    octaves = fft.getOctaveBands(6, 20);
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
    var spectrum = fft.analyze();
    var logbands = fft.logAverages(octaves);
    var dim = logbands.length;
    
    background(11);
    colorMode(HSB);
    strokeWeight(width / dim + 2);
    
    for (var i = 0; i <= dim; i++){        
        var x = width * i / dim + width / dim / 2;
        var h = height * 1.3 - height * logbands[i] / 255;
        
        stroke(i / dim * 255, 100, 100);
        line(x, height, x, h);
    }
}