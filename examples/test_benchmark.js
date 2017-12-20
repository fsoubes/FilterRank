////////////////////////////////////////
/////////// Variance_filter ////////////
////////////////////////////////////////
"use strict";
//720*576
/*
let kernel_size = 2;
let pixels = boats_720x576;
let  uint16_blobs = boats_720x576.map ((px) => px * 256);
let float_blobs = boats_720x576.map( (px) => px/128 - 1.0);




let img1 = new T.Image('uint8',720,576);
img1.setPixels(boats_720x576);
let win1 = new T.Window('Blobs 8 bit');
let view1 = T.view(img1.getRaster());
win1.addView(view1);
win1.addToDOM('workspace');


let img2 = new T.Image('uint8',720,576);

//let ImgI = variance(img0,img111,kernel_size);

img2.setPixels(boats_720x576);


let test = img2.getRaster();

var t0 = performance.now();
for (let i=0; i<10;i++){
    variance(2)(test);
}
var t1 = performance.now();
console.log("L'appel à variance 8 bit a pris " + ((t1 - t0)/10).toFixed(4) + " millisecondes.")


let img01 = new T.Image('uint16',720,576);
img01.setPixels(uint16_blobs);
let win01 = new T.Window('Blobs uint16 cropped');
let view01 = T.view(img01.getRaster());
// Create the window content from the view
win01.addView(view01);
// Add the window to the DOM and display it
win01.addToDOM('workspace');


let img02 = new T.Image('uint16',720,576);
img02.setPixels(uint16_blobs);
let test1 = img02.getRaster();

var t00 = performance.now();
for (let i=0; i<10;i++){

    variance(2)(test1);
}
var t11 = performance.now();
console.log("L'appel à variance 16bit a pris " + ((t11 - t00)/10).toFixed(4) + " millisecondes.")




// Display float32 images.



let img001 = new T.Image('float32',720,576);

img001.setPixels(float_blobs);



let win001 = new T.Window('Blobs float32');
let view001 = T.view(img001.getRaster());

win001.addView(view001);

win001.addToDOM('workspace');


// can't crop float32

let img002 = new T.Image('float32',720,576);
img002.setPixels(float_blobs);
let test2 = img002.getRaster();

var t000 = performance.now();
for (let i=0; i<10;i++){
    //console.log(img111);
    variance(2)(test2);
}
var t111 = performance.now();
console.log("L'appel à variance float  a pris " + ((t111 - t000)/10).toFixed(4) + " millisecondes.")

*/
/*

//1080*864

let kernel_size = 2;
let pixels = boats_1080x864;



let  uint16_blobs = boats_1080x864.map ((px) => px * 256);
let uint16_blobss = boats_1080x864.map ((px) => px * 256);



let float_blobs = boats_1080x864.map( (px) => px/128 - 1.0);
let float_blobss = boats_1080x864.map( (px) => px/128 - 1.0);





let img1 = new T.Image('uint8',1080,864);
img1.setPixels(boats_1080x864);
let win1 = new T.Window('Blobs 8 bit');
let view1 = T.view(img1.getRaster());
win1.addView(view1);
win1.addToDOM('workspace');


let img2 = new T.Image('uint8',1080,864);

//let ImgI = variance(img0,img111,kernel_size);

img2.setPixels(boats_1080x864);


let test = img2.getRaster();

var t0 = performance.now();
for (let i=0; i<10;i++){
    variance(2)(test);
}
var t1 = performance.now();
console.log("L'appel à variance 8 bit a pris " + ((t1 - t0)/10).toFixed(4) + " millisecondes.")


let img01 = new T.Image('uint16',1080,864);
img01.setPixels(uint16_blobs);
let win01 = new T.Window('Blobs uint16 cropped');
let view01 = T.view(img01.getRaster());
// Create the window content from the view
win01.addView(view01);
// Add the window to the DOM and display it
win01.addToDOM('workspace');


let img02 = new T.Image('uint16',1080,864);
img02.setPixels(uint16_blobs);
let test1 = img02.getRaster();

var t00 = performance.now();
for (let i=0; i<10;i++){

    variance(2)(test1);
}
var t11 = performance.now();
console.log("L'appel à variance 16bit a pris " + ((t11 - t00)/10).toFixed(4) + " millisecondes.")




// Display float32 images.



let img001 = new T.Image('float32',1080,864);

img001.setPixels(float_blobs);



let win001 = new T.Window('Blobs float32');
let view001 = T.view(img001.getRaster());

win001.addView(view001);

win001.addToDOM('workspace');


// can't crop float32

let img002 = new T.Image('float32',1080,864);
img002.setPixels(float_blobs);
let test2 = img002.getRaster();

var t000 = performance.now();
for (let i=0; i<10;i++){
    //console.log(img111);
    variance(2)(test2);
}
var t111 = performance.now();
console.log("L'appel à variance float  a pris " + ((t111 - t000)/10).toFixed(4) + " millisecondes.")


*/

//1440*1152

/*
let kernel_size = 2;
let pixels = boats_1440x1152;



let  uint16_blobs = boats_1440x1152.map ((px) => px * 256);
let uint16_blobss = boats_1440x1152.map ((px) => px * 256);



let float_blobs = boats_1440x1152.map( (px) => px/128 - 1.0);
let float_blobss = boats_1440x1152.map( (px) => px/128 - 1.0);





let img1 = new T.Image('uint8',1440,1152);
img1.setPixels(boats_1440x1152);
let win1 = new T.Window('Blobs 8 bit');
let view1 = T.view(img1.getRaster());
win1.addView(view1);
win1.addToDOM('workspace');


let img2 = new T.Image('uint8',1440,1152);

//let ImgI = variance(img0,img111,kernel_size);

img2.setPixels(boats_1440x1152);


let test = img2.getRaster();

var t0 = performance.now();
for (let i=0; i<10;i++){
    variance(2)(test);
}
var t1 = performance.now();
console.log("L'appel à variance 8 bit a pris " + ((t1 - t0)/10).toFixed(4) + " millisecondes.")


let img01 = new T.Image('uint16',1440,1152);
img01.setPixels(uint16_blobs);
let win01 = new T.Window('Blobs uint16 cropped');
let view01 = T.view(img01.getRaster());
// Create the window content from the view
win01.addView(view01);
// Add the window to the DOM and display it
win01.addToDOM('workspace');


let img02 = new T.Image('uint16',1440,1152);
img02.setPixels(uint16_blobs);
let test1 = img02.getRaster();

var t00 = performance.now();
for (let i=0; i<10;i++){

    variance(2)(test1);
}
var t11 = performance.now();
console.log("L'appel à variance 16bit a pris " + ((t11 - t00)/10).toFixed(4) + " millisecondes.")




// Display float32 images.



let img001 = new T.Image('float32',1440,1152);

img001.setPixels(float_blobs);



let win001 = new T.Window('Blobs float32');
let view001 = T.view(img001.getRaster());

win001.addView(view001);

win001.addToDOM('workspace');


// can't crop float32

let img002 = new T.Image('float32',1440,1152);
img002.setPixels(float_blobs);
let test2 = img002.getRaster();

var t000 = performance.now();
for (let i=0; i<10;i++){
    //console.log(img111);
    variance(2)(test2);
}
var t111 = performance.now();
console.log("L'appel à variance float  a pris " + ((t111 - t000)/10).toFixed(4) + " millisecondes.")

*/

/*
//1880*1440


let kernel_size = 2;
let pixels = boats_1800x1440;



let  uint16_blobs = boats_1800x1440.map ((px) => px * 256);
let uint16_blobss = boats_1800x1440.map ((px) => px * 256);



let float_blobs = boats_1800x1440.map( (px) => px/128 - 1.0);
let float_blobss = boats_1800x1440.map( (px) => px/128 - 1.0);





let img1 = new T.Image('uint8',1800,1440);
img1.setPixels(boats_1800x1440);
let win1 = new T.Window('Blobs 8 bit');
let view1 = T.view(img1.getRaster());
win1.addView(view1);
win1.addToDOM('workspace');


let img2 = new T.Image('uint8',1800,1440);

//let ImgI = variance(img0,img111,kernel_size);

img2.setPixels(boats_1800x1440);


let test = img2.getRaster();

var t0 = performance.now();
for (let i=0; i<10;i++){
    variance(2)(test);
}
var t1 = performance.now();
console.log("L'appel à variance 8 bit a pris " + ((t1 - t0)/10).toFixed(4) + " millisecondes.")


let img01 = new T.Image('uint16',1800,1440);
img01.setPixels(uint16_blobs);
let win01 = new T.Window('Blobs uint16 cropped');
let view01 = T.view(img01.getRaster());
// Create the window content from the view
win01.addView(view01);
// Add the window to the DOM and display it
win01.addToDOM('workspace');


let img02 = new T.Image('uint16',1800,1440);
img02.setPixels(uint16_blobs);
let test1 = img02.getRaster();

var t00 = performance.now();
for (let i=0; i<10;i++){

    variance(2)(test1);
}
var t11 = performance.now();
console.log("L'appel à variance 16bit a pris " + ((t11 - t00)/10).toFixed(4) + " millisecondes.")




// Display float32 images.



let img001 = new T.Image('float32',1800,1440);

img001.setPixels(float_blobs);



let win001 = new T.Window('Blobs float32');
let view001 = T.view(img001.getRaster());

win001.addView(view001);

win001.addToDOM('workspace');


// can't crop float32

let img002 = new T.Image('float32',1800,1440);
img002.setPixels(float_blobs);
let test2 = img002.getRaster();

var t000 = performance.now();
for (let i=0; i<10;i++){
    //console.log(img111);
    variance(2)(test2);
}
var t111 = performance.now();
console.log("L'appel à variance float  a pris " + ((t111 - t000)/10).toFixed(4) + " millisecondes.")

*/

//2880*2304

let kernel_size = 2;
//let width_size = ;
//let height_size = ;

let pixels = boats_2880x2304;



let  uint16_blobs = pixels.map ((px) => px * 256);
let uint16_blobss = pixels.map ((px) => px * 256);



let float_blobs = pixels.map( (px) => px/128 - 1.0);
let float_blobss = pixels.map( (px) => px/128 - 1.0);





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
    variance(2)(test);
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
for (let i=0; i<10;i++){

    variance(2)(test1);
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
    variance(2)(test2);
}
var t111 = performance.now();
console.log("L'appel à variance float  a pris " + ((t111 - t000)/10).toFixed(4) + " millisecondes.")


