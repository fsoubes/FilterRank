////////////////////////////////////////
/////////// Variance_filter ////////////
////////////////////////////////////////
"use strict";

/**
 * Display uint8 images
 */

let pixels = blobs_pixels;

//let img0 = new T.Image('uint8',360,288);
let img0 = new T.Image('uint8',256,254);
//img0.setPixels(boats_pixels);
img0.setPixels(pixels);
let win0 = new T.Window('Blobs 8 bit');
let view0 = T.view(img0.getRaster());
win0.addView(view0);
win0.addToDOM('workspace');

/*
//let img1 = new T.Image('uint8',360,288);
let img1 = new T.Image('uint8',256,254);
img1.setPixels(pixels);
let workflow = T.pipe(variance(2),T.view);
let view1 = workflow(img0.getRaster());
let win1 = new T.Window('Blobs 8bit');
win1.addView(view1);
win1.addToDOM("workspace");
*/

let kernel_size = 2 ;
//let img1 = new T.Image('uint8',360,288);
let img1 = new T.Image('uint8',256,254);
img1.setPixels(pixels);

let workflow = T.pipe(variance(kernel_size),T.view);
//let process = T.pipe(T.crop(1,2,img1.width - kernel_size,img1.height - kernel_size),T.view);
let view1 = workflow(img0.getRaster());
console.log(view1);
let win1 = new T.Window('Blobs 8bit');
win1.addView(view1);
win1.addToDOM("workspace");

//let process1 = T.pipe(T.crop(1,2,img03.width - kernel_size,img03.height - kernel_size),T.view);

/*
//Display uint16 image/

let img01 = new T.Image('uint16',256,254);
let uint16_blobs = blobs_pixels.map ( (px) => px * 256);
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
img03.setPixels(ImgII);
let process1 = T.pipe(T.crop(1,2,img03.width - kernel_size,img03.height - kernel_size),T.view);
let view03 = process1(img03.getRaster());
let win03 = new T.Window('Blobs crop uint16');
win03.addView(view03);
win03.addToDOM('workspace');

// Display float32 images/


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

let ImgIII = variance(img001,kernel_size);
let img002= new T.Image('float32',256,254);
//let img002 = new T.Image('float32',360,288);

img002.setPixels(ImgIII);
let process2 = T.pipe(T.crop(1,2,img002.width - kernel_size,img002.height - kernel_size),T.view);
//let view002 = process2(img002.getRaster());
let win002 = new T.Window('Blobs float32 croped');
let view002 = T.view(img002.getRaster());
win002.addView(view002);
win002.addToDOM('workspace');

/*
let img003 = new T.Image('float32',256,254);
img003.setPixels(ImgIII);
let process2 = T.pipe(T.crop(1,1,img003.width - kernel_size,img003.height - kernel_size),T.view);
let view003 = process2(img003.getRaster());
let win003 = new T.Window('Blobs crop uint16');
win003.addView(view003);
win003.addToDOM('workspace');
   
let img0001 = new T.Image('float32',256,254);
//let img001 = new T.Image('float32',360,288);
//let float_boats = boats_pixels.map( (px) => px/128 - 1.0);
//let float_blobs = blobs_pixels.map( (px) => px/128 - 1.0);
img0001.setPixels(float_blobs);
//img001.setPixels(float_boats);
let win0001 = new T.Window('Blobs float32');
let view0001 = process(img0001.getRaster());
//let view0001 = T.view(img0001.getRaster());
// Create the window content from the view
win0001.addView(view0001);
// Add the window to the DOM and display it
win0001.addToDOM('workspace');
*/
