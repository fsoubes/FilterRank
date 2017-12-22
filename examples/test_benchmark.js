////////////////////////////////////////
/////////// Variance_filter ////////////
////////////////////////////////////////
"use strict";


//2880*2304

let kernel = new T.Raster('uint8',2,2);
let kernel_size = kernel.width;
let width_size = 720;
let height_size = 576;

let pixels = boats_720x576;
let uint16_blobs = pixels.map ((px) => px * 256);
let float_blobs = pixels.map( (px) => px/128 - 1.0);






let img1 = new T.Image('uint8',width_size,height_size);
img1.setPixels(pixels);
let win1 = new T.Window('Blobs 8 bit');
let view1 = T.view(img1.getRaster());
win1.addView(view1);
win1.addToDOM('workspace');


let img2 = new T.Image('uint8',width_size,height_size);

//let ImgI = variance(img0,img111,kernel_size);

img2.setPixels(pixels);


let test = img2.getRaster();

var t0 = performance.now();
for (let i=0; i<10;i++){
    variance(kernel)(test);
}
var t1 = performance.now();
console.log("L'appel à variance 8 bit a pris " + ((t1 - t0)/10).toFixed(4) + " millisecondes.")


let img01 = new T.Image('uint16',width_size,height_size);
img01.setPixels(uint16_blobs);
let win01 = new T.Window('Blobs uint16 cropped');
let view01 = T.view(img01.getRaster());
// Create the window content from the view
win01.addView(view01);
// Add the window to the DOM and display it
win01.addToDOM('workspace');


let img02 = new T.Image('uint16',width_size,height_size);
img02.setPixels(uint16_blobs);
let test1 = img02.getRaster();

var t00 = performance.now();
for (let i=1; i<=10;i++){

    variance(kernel)(test1);
}
var t11 = performance.now();
console.log("L'appel à variance 16bit a pris " + ((t11 - t00)/10).toFixed(4) + " millisecondes.")




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
let test2 = img002.getRaster();

var t000 = performance.now();
for (let i=0; i<10;i++){
    //console.log(img111);
    variance(kernel)(test2);
}
var t111 = performance.now();
console.log("L'appel à variance float  a pris " + ((t111 - t000)/10).toFixed(4) + " millisecondes.")


