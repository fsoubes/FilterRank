////////////////////////////////////////
/////////// Variance_filter ////////////
////////////////////////////////////////
"use strict";

/**
 * Display uint8 images
 */



let kernel_size = 2;
let pixels = blobs_pixels;

let img111 = new T.Image('uint8',256,254);
let sqrt_uint_8_blobs = blobs_pixels.map((x) => x * x );
img111.setPixels(sqrt_uint_8_blobs);

let img222 = new T.Image('uint16',256,254);
let uint16_blobs = blobs_pixels.map ((px) => px * 256);
let uint16_blobss = blobs_pixels.map ((px) => px * 256);
let sqrt_uint16_blobs = uint16_blobs.map((x) => x * x );
img222.setPixels(sqrt_uint16_blobs);

let img333 = new T.Image('float32',256,254);
let float_blobs = blobs_pixels.map( (px) => px/128 - 1.0);
let float_blobss = blobs_pixels.map( (px) => px/128 - 1.0);
let sqrt_float_blobs = float_blobs.map((x) => x * x );
img333.setPixels(sqrt_float_blobs);




//let img0 = new T.Image('uint8',360,288);
let img1 = new T.Image('uint8',256,254);
//img0.setPixels(boats_pixels);
img1.setPixels(pixels);
let win1 = new T.Window('Blobs 8 bit');
let view1 = T.view(img1.getRaster());
win1.addView(view1);
win1.addToDOM('workspace');



let img2 = new T.Image('uint8',256,254);
//let ImgI = variance(img0,img111,kernel_size);
img2.setPixels(blobs_pixels);
let win2 = new T.Window('Blob 8bit cropped');
let workflow = T.pipe(variance(2,img111),T.view);
let view2 = workflow(img2.getRaster());
let crop8 = T.pipe(T.crop(1,2,view2.width - kernel_size, view2.height - kernel_size), T.view);
let view3 = crop8(img2.getRaster());
win2.addView(view2);
win2.addToDOM('workspace');
//let img2 = new T.Image('uint8',360,288);



/**
 * Display uint16 images
 */

let img01 = new T.Image('uint16',256,254);
img01.setPixels(uint16_blobss);
let win01 = new T.Window('Blobs uint16 cropped');
let view01 = T.view(img01.getRaster());
// Create the window content from the view
win01.addView(view01);
// Add the window to the DOM and display it
win01.addToDOM('workspace');


let img02 = new T.Image('uint16',256,254);
img02.setPixels(uint16_blobs);
let win02 = new T.Window('Blobs uint16');
let workflow1 = T.pipe(variance(2,img222),T.view);
let view02 = workflow1(img02.getRaster());
let cropp16 = T.pipe(T.crop(1,2,view02.width - kernel_size, view02.height - kernel_size), T.view);
let view03 = cropp16(img02.getRaster());
win02.addView(view03);
win02.addToDOM('workspace');

 


// Display float32 images.



let img001 = new T.Image('float32',256,254);
//let img001 = new T.Image('float32',360,288);
//let float_boats = boats_pixels.map( (px) => px/128 - 1.0);
img001.setPixels(float_blobss);
//img001.setPixels(float_boats);
let win001 = new T.Window('Blobs float32');
let view001 = T.view(img001.getRaster());
// Create the window content from the view
win001.addView(view001);
// Add the window to the DOM and display it
win001.addToDOM('workspace');


// can't crop float32

let img002 = new T.Image('float32',256,254);
img002.setPixels(float_blobs);
let win002 = new T.Window('Blobs float32');
let workflow2 = T.pipe(variance(2,img333),T.view);
let view002 = workflow2(img002.getRaster());
//let croppfloat = T.pipe(T.crop(1,2,view002.width - kernel_size, view002.height - kernel_size), T.view);
//let view003 = croppfloat(img002.getRaster());
win002.addView(view002);
win002.addToDOM('workspace');






