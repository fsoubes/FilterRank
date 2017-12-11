////////////////////////////////////////
/////////// Variance_filter ////////////
////////////////////////////////////////
"use strict";

/**
 * Display uint8 images
 */

//let img0 = new T.Image('uint8',360,288);
let img0 = new T.Image('uint8',256,254);
//img0.setPixels(boats_pixels);
img0.setPixels(blobs_pixels);
let win0 = new T.Window('Blobs 8 bit');
let view0 = T.view(img0.getRaster());
win0.addView(view0);
win0.addToDOM('workspace');


//let img1 = new T.Image('uint8',360,288);
let img1 = new T.Image('uint8',256,254);
let win1 = new T.Window('Blobs 8bit');
let view1 = T.view(img1.getRaster());

let kernel_size=2;
let ImgI = variance(img0,kernel_size);

//console.log(ImgI);
let img2 = new T.Image('uint8',256,254);
img2.setPixels(ImgI);
let win2 = new T.Window('Blob 8bit');
let view2 = T.view(img2.getRaster());
win2.addView(view2);
win2.addToDOM('workspace');
//let img2 = new T.Image('uint8',360,288);

let img3 = new T.Image('uint8',256,254);
img3.setPixels(ImgI);
console.log("ok");
console.log(img2.width);
let process = T.pipe(T.crop(1,1,img3.width - kernel_size,img3.height - kernel_size),T.view);
let view3 = process(img3.getRaster());
let win3 = new T.Window('Blobs crop uint8');
win3.addView(view3);
win3.addToDOM('workspace');

/**
 * Display uint16 images
 */

let img01 = new T.Image('uint16',256,254);
let uint16_blobs = blobs_pixels.map ( (px) => px * 256);
console.log(uint16_blobs);
console.log("guigui");
img01.setPixels(uint16_blobs);
let win01 = new T.Window('Blobs uint16');
let view01 = T.view(img01.getRaster());
// Create the window content from the view
win01.addView(view01);
// Add the window to the DOM and display it
win01.addToDOM('workspace');


let img02 = new T.Image('uint16',256,254);
let ImgII = variance(img01,kernel_size);
img02.setPixels(ImgII);
let win02 = new T.Window('Blobs uint16');
let view02 = T.view(img02.getRaster());
win02.addView(view02);
win02.addToDOM('workspace');


let img03 = new T.Image('uint16',256,254);
img03.setPixels(ImgI);
let process1 = T.pipe(T.crop(1,1,img03.width - kernel_size,img03.height - kernel_size),T.view);
let view03 = process1(img03.getRaster());
let win03 = new T.Window('Blobs crop uint16');
win03.addView(view03);
win03.addToDOM('workspace');

/**
 * Display float32 images
 */


let img001 = new T.Image('float32',256,254);
//let img001 = new T.Image('float32',360,288);
//let float_boats = boats_pixels.map( (px) => px/128 - 1.0);
let float_blobs = blobs_pixels.map( (px) => px/128 - 1.0);
img001.setPixels(float_blobs);
//img001.setPixels(float_boats);
let win001 = new T.Window('Blobs float32');
let view001 = T.view(img001.getRaster());
// Create the window content from the view
win001.addView(view001);
// Add the window to the DOM and display it
win001.addToDOM('workspace');


let img002 = new T.Image('float32',256,254);
//let img002 = new T.Image('float32',360,288);
let ImgIII = variance(img002,kernel_size);
img002.setPixels(ImgIII);
let win002 = new T.Window('Blobs float32');
let view002 = T.view(img002.getRaster());
win002.addView(view002);
win002.addToDOM('workspace');

let img003 = new T.Image('uint16',256,254);
img003.setPixels(ImgI);
let process2 = T.pipe(T.crop(1,1,img003.width - kernel_size,img003.height - kernel_size),T.view);
let view003 = process1(img003.getRaster());
let win003 = new T.Window('Blobs crop uint16');
win003.addView(view003);
win003.addToDOM('workspace');

/**
 * Display argb images
 */




