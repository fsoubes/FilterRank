"use strict";

let sizeWidth = 360;
let sizeHeight = 288;
let sampleName = boats_pixels;
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

let win0 = new T.Window('image');
let view0 = T.view(img0.getRaster());
// Create the window content from the view
win0.addView(view0);
// Add the window to the DOM and display it
win0.addToDOM('workspace');

//let kernelSize = 11;
let kernel = new T.Raster('uint8',3,3);

/*
let nbTest=100;
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
console.log('Took', ((t1 - t0) / nbTest).toFixed(4), 'milliseconds to generate');*/


let medianFilteredImg0 = medianFilter(kernel)(raster0);
let win10 = new T.Window('New 8bit');
let view10 = T.view(medianFilteredImg0);
win10.addView(view10);
win10.addToDOM('workspace');


let medianFilteredImg1 = medianFilter(kernel)(raster01);
let medianFilteredImg2 = medianFilter(kernel)(raster02);
let win20 = new T.Window('New 16bit');
let win30 = new T.Window('New Float32');
let view20 = T.view(medianFilteredImg1);
let view30 = T.view(medianFilteredImg2);
win20.addView(view20);
win30.addView(view30);
win20.addToDOM('workspace');
win30.addToDOM('workspace');


const max = 'max';
const min = 'min';

// image de base
let img0 = new T.Image('uint8',256,254);
img0.setPixels(blobs_pixels);
let win0 = new T.Window('Blob 8bit');
let view0 = T.view(img0.getRaster());
win0.addView(view0);
win0.addToDOM('workspace');

//function min_max 
let filtre8 =min_max(img0,7,max);

let img8 = new T.Image('uint8',256,254);
img8.setPixels(filtre8);
let win8 = new T.Window('Blob min_max filter 8 bit');
let view8 = T.view(img8.getRaster());
win8.addView(view8);
win8.addToDOM('workspace');
   
                     

 // Display uint16 images
 
let img01 = new T.Image('uint16',256,254);
let uint16_blobs = blobs_pixels.map ( (px) => px * 256);
img01.setPixels(uint16_blobs);
let win01 = new T.Window('Blobs uint16');
let view01 = T.view(img01.getRaster());
// Create the window content from the view
win01.addView(view01);
// Add the window to the DOM and display it
win01.addToDOM('workspace');

// function min_max
let filtre16 =min_max(img01,9,max);


let img32 = new T.Image('uint16',256,254);
img32.setPixels(filtre16);
let win12 = new T.Window('Blob min_max filter 16 bit');
let view12 = T.view(img32.getRaster());
win12.addView(view12);
win12.addToDOM('workspace');


 // Display float32 images
 
let img03 = new T.Image('float32',256,254);
let float_boats = blobs_pixels.map( (px) => px/128 - 1.0);
img03.setPixels(float_boats);
let win02 = new T.Window('Blobs float32');
let view02 = T.view(img03.getRaster());
// Create the window content from the view
win02.addView(view02);
// Add the window to the DOM and display it
win02.addToDOM('workspace');


// function min_max
let filtre2 =min_max(img03,11,min);



//image after filtre

let img2 = new T.Image('float32',256,254);
img2.setPixels(filtre2);
let win2 = new T.Window('Blob min_max filter 32 bit');
let view2 = T.view(img2.getRaster());
win2.addView(view2);
win2.addToDOM('workspace');

// pr chaque function faire en output le T.raster au debut
// let output = T.Raster.from(img.raster,copy_mode);


////////////////////////////////////////
/////////// Variance_filter ////////////
////////////////////////////////////////
"use strict";

/**
 * Display uint8 images
 */


let width_size = 360;
let height_size = 288;
let pixels = boats_pixels;
let uint16_blobs = pixels.map ((px) => px * 256);
let float_blobs = pixels.map( (px) => px/128 - 1.0);
let kernel = new T.Raster('uint8',2,2);
let kernel_size = kernel.width;


let img1 = new T.Image('uint8',width_size,height_size);
img1.setPixels(pixels);
let win1 = new T.Window('Boats 8 bit');
let view1 = T.view(img1.getRaster());
win1.addView(view1);
win1.addToDOM('workspace');


let img2 = new T.Image('uint8',width_size,height_size);
img2.setPixels(pixels);
let win2 = new T.Window('Boats 8bit with variance filter croped');
let workflow = T.pipe(variance(kernel),T.view);
let view2 = workflow(img2.getRaster());
let crop8 = T.pipe(T.crop(1,2,view2.width - kernel_size, view2.height - kernel_size), T.view);
crop8(img2.getRaster());
win2.addView(view2);
win2.addToDOM('workspace');


/**
 * Display uint16 images
 */

let img01 = new T.Image('uint16',width_size,height_size);
img01.setPixels(uint16_blobs);
let win01 = new T.Window('Boats uint16 ');
let view01 = T.view(img01.getRaster());
win01.addView(view01);
win01.addToDOM('workspace');


let img02 = new T.Image('uint16',width_size,height_size);
img02.setPixels(uint16_blobs);
let win02 = new T.Window('Boats uint16  with variance filter croped');
let workflow1 = T.pipe(variance(kernel),T.view);
let view02 = workflow1(img02.getRaster());
let cropp16 = T.pipe(T.crop(1,2,view02.width - kernel_size, view02.height - kernel_size), T.view);
cropp16(img02.getRaster());
win02.addView(view02);
win02.addToDOM('workspace');

 


// Display float32 images.


let img001 = new T.Image('float32',width_size,height_size);
img001.setPixels(float_blobs);
let win001 = new T.Window('Blobs float32');
let view001 = T.view(img001.getRaster());
win001.addView(view001);
win001.addToDOM('workspace');


// can't crop float32

let img002 = new T.Image('float32',width_size,height_size);
img002.setPixels(float_blobs);
let win002 = new T.Window('Blobs float32 with variance filter');
let workflow2 = T.pipe(variance(kernel),T.view);
let view002 = workflow2(img002.getRaster());
win002.addView(view002);
win002.addToDOM('workspace');