"use strict";
///////////Variance_filter////////////

//let img0 = new T.Image('uint8',360,288);
let img0 = new T.Image('uint8',256,254);
//img0.setPixels(boats_pixels);
img0.setPixels(blobs_pixels);
let win0 = new T.Window('Boats');
let view0 = T.view(img0.getRaster());
win0.addView(view0);
win0.addToDOM('workspace');




//let img1 = new T.Image('uint8',360,288);
let img1 = new T.Image('uint8',256,254);
let win1 = new T.Window('Boats');
let view1 = T.view(img1.getRaster());

let kernel_size;
let ImgI = variance(img0,kernel_size);

//console.log(ImgI);

//let img2 = new T.Image('uint8',360,288);
let img2 = new T.Image('uint8',256,254);
img2.setPixels(ImgI);
let win2 = new T.Window('Boats');
let view2 = T.view(img2.getRaster());
win2.addView(view2);
win2.addToDOM('workspace');










