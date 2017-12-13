"use strict";

let kernelSize = 3;



let img0 = new T.Image('uint8',256,254);
img0.setPixels(blobs_pixels);
/*let win0 = new T.Window('Blobs');
let view0 = T.view(img0.getRaster());
win0.addView(view0);
win0.addToDOM('workspace');
console.log(img0.raster.pixelData);*/

let img01 = new T.Image('uint16',256,254);
let uint16_blobs = blobs_pixels.map ( (px) => px * 256);
img01.setPixels(uint16_blobs);
/*let win01 = new T.Window('Blobs uint16');
let view01 = T.view(img01.getRaster());
// Create the window content from the view
win01.addView(view01);
// Add the window to the DOM and display it
win01.addToDOM('workspace');
console.log(img01.raster.pixelData);*/

let img02 = new T.Image('float32',256,254);
let float_blobs = blobs_pixels.map( (px) => px/128 - 1.0);
img02.setPixels(float_blobs);
let win02 = new T.Window('Blobs float32');
let view02 = T.view(img02.getRaster());
// Create the window content from the view
win02.addView(view02);
// Add the window to the DOM and display it
win02.addToDOM('workspace');
console.log(img02.raster.pixelData);



let medianFilteredImg0 = js5_medianFilter(img0, Math.floor(kernelSize/2));
let medianFilteredImg1 = js5_medianFilter(img01, Math.floor(kernelSize/2));
let medianFilteredImg2 = js5_medianFilter(img02, Math.floor(kernelSize/2));
let img10 = new T.Image('uint8',256,254);
let img20 = new T.Image('uint16',256,254);
let img30 = new T.Image('float32',256,254);
img10.setPixels(medianFilteredImg0);
img20.setPixels(medianFilteredImg1);
img30.setPixels(medianFilteredImg2);
let win10 = new T.Window('New Blobs');
let win20 = new T.Window('New Blobs');
let win30 = new T.Window('New Blobs');
let view10 = T.view(img10.getRaster());
let view20 = T.view(img20.getRaster());
let view30 = T.view(img30.getRaster());
win10.addView(view10);
win20.addView(view20);
win30.addView(view30);
win10.addToDOM('workspace');
win20.addToDOM('workspace');
win30.addToDOM('workspace');

