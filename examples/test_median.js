"use strict";

let sizeWidth = 900;
let sizeHeight = 720;
let sampleName = boats_900x720;
//let img0 = new T.Image('uint8',256,254);
let img0 = new T.Image('uint8',sizeWidth,sizeHeight);
//img0.setPixels(blobs_pixels);
img0.setPixels(sampleName);
let raster0 = img0.getRaster();
//let img01 = new T.Image('uint16',256,254);
let img01 = new T.Image('uint16',sizeWidth,sizeHeight);
//let uint16_blobs = blobs_pixels.map ( (px) => px * 256);
let uint16_blobs = sampleName.map ( (px) => px * 256);
img01.setPixels(uint16_blobs);
let raster01 = img01.getRaster();
//let img02 = new T.Image('float32',256,254);
let img02 = new T.Image('float32',sizeWidth,sizeHeight);
//let float_blobs = blobs_pixels.map( (px) => px/128 - 1.0);
let float_blobs = sampleName.map( (px) => px/128 - 1.0);
img02.setPixels(float_blobs);
let raster02 = img02.getRaster();
let win02 = new T.Window('Blobs float32');
let view02 = T.view(img02.getRaster());
// Create the window content from the view
win02.addView(view02);
// Add the window to the DOM and display it
win02.addToDOM('workspace');
console.log(img02.raster.pixelData);

//let kernelSize = 11;
let kernel = new T.Raster('uint8',2,2);

let nbTest=1;

var t0 = performance.now();
for (var i = 0; i < nbTest; i++) {
    medianFilter(kernel)(raster0);
}
var t1 = performance.now();
console.log('8 bit');
console.log('Took', ((t1 - t0) / nbTest).toFixed(4), 'milliseconds to generate');

var t0 = performance.now();
for (var i = 0; i < nbTest; i++) {
    medianFilter(kernel)(raster01);
}
var t1 = performance.now();
console.log('16 bit');
console.log('Took', ((t1 - t0) / nbTest).toFixed(4), 'milliseconds to generate');

var t0 = performance.now();
for (var i = 0; i < nbTest; i++) {
    medianFilter(kernel)(raster02);
}
var t1 = performance.now();
console.log('float 32');
console.log('Took', ((t1 - t0) / nbTest).toFixed(4), 'milliseconds to generate');


let medianFilteredImg0 = medianFilter(kernel)(raster0);
let win10 = new T.Window('New Blobs');
let view10 = T.view(medianFilteredImg0);
win10.addView(view10);
win10.addToDOM('workspace');


let medianFilteredImg1 = medianFilter(kernel)(raster01);
let medianFilteredImg2 = medianFilter(kernel)(raster02);
let win20 = new T.Window('New Blobs');
let win30 = new T.Window('New Blobs');
let view20 = T.view(medianFilteredImg1);
let view30 = T.view(medianFilteredImg2);
win20.addView(view20);
win30.addView(view30);
win20.addToDOM('workspace');
win30.addToDOM('workspace');
