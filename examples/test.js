"use strict";

const wk= 3;
const hk = 3;

//let img0 = new T.Image('uint8',360,288);
let img0 = new T.Image('uint8',256,254);
//img0.setPixels(boats_pixels);
img0.setPixels(blobs_pixels);
let win0 = new T.Window('Boats');
let view0 = T.view(img0.getRaster());
win0.addView(view0);
win0.addToDOM('workspace');


//let imgsqr = boats_pixels.map((x) => x * x );
let imgsqr = blobs_pixels.map((x) => x * x );
//let img1 = new T.Image('uint8',360,288);
let img1 = new T.Image('uint8',256,254);
img1.setPixels(imgsqr);
let win1 = new T.Window('Boats');
let view1 = T.view(img1.getRaster());


let ImgI = variance(img0,img1,wk,hk);
console.log(ImgI);

//let img2 = new T.Image('uint8',360,288);
let img2 = new T.Image('uint8',256,254);
img2.setPixels(ImgI);
let win2 = new T.Window('Boats');
let view2 = T.view(img2.getRaster());
win2.addView(view2);
win2.addToDOM('workspace');










