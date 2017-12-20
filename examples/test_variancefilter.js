////////////////////////////////////////
/////////// Variance_filter ////////////
////////////////////////////////////////
"use strict";

/**
 * Display uint8 images
 */


let pixels = blobs_pixels;
let sqrt_uint_8_blobs = blobs_pixels.map((x) => x * x );
let uint16_blobs = blobs_pixels.map ((px) => px * 256);
let float_blobs = blobs_pixels.map( (px) => px/128 - 1.0);
let kernel = new T.Raster('uint8',3,3);
let kernel_size = kernel.width;


let img1 = new T.Image('uint8',256,254);
img1.setPixels(pixels);
let win1 = new T.Window('Blobs 8 bit');
let view1 = T.view(img1.getRaster());
win1.addView(view1);
win1.addToDOM('workspace');



let img2 = new T.Image('uint8',256,254);
img2.setPixels(blobs_pixels);
let win2 = new T.Window('Blob 8bit cropped');
let workflow = T.pipe(variance(kernel),T.view);
let view2 = workflow(img2.getRaster());
let crop8 = T.pipe(T.crop(1,2,view2.width - kernel_size, view2.height - kernel_size), T.view);
crop8(img2.getRaster());
win2.addView(view2);
win2.addToDOM('workspace');


/**
 * Display uint16 images
 */

let img01 = new T.Image('uint16',256,254);
img01.setPixels(uint16_blobs);
let win01 = new T.Window('Blobs uint16 cropped');
let view01 = T.view(img01.getRaster());
win01.addView(view01);
win01.addToDOM('workspace');


let img02 = new T.Image('uint16',256,254);
img02.setPixels(uint16_blobs);
let win02 = new T.Window('Blobs uint16');
let workflow1 = T.pipe(variance(kernel),T.view);
let view02 = workflow1(img02.getRaster());
let cropp16 = T.pipe(T.crop(1,2,view02.width - kernel_size, view02.height - kernel_size), T.view);
cropp16(img02.getRaster());
win02.addView(view02);
win02.addToDOM('workspace');

 


// Display float32 images.



let img001 = new T.Image('float32',256,254);
img001.setPixels(float_blobs);
let win001 = new T.Window('Blobs float32');
let view001 = T.view(img001.getRaster());
win001.addView(view001);
win001.addToDOM('workspace');


// can't crop float32

let img002 = new T.Image('float32',256,254);
img002.setPixels(float_blobs);
let win002 = new T.Window('Blobs float32');
let workflow2 = T.pipe(variance(kernel),T.view);
let view002 = workflow2(img002.getRaster());
win002.addView(view002);
win002.addToDOM('workspace');






