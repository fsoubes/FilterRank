const max = 'max';
const min = 'min';

// image de base
let img0 = new T.Image('uint8',360,280);
img0.setPixels(boats_pixels);
let win0 = new T.Window('Blob 8bit');
let view0 = T.view(img0.getRaster());
win0.addView(view0);
win0.addToDOM('workspace');

let filtre8 =min_max(img0,5,max);

let img8 = new T.Image('uint8',360,280);
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

let filtre16 =min_max(img01,5,max);

let img32 = new T.Image('uint16',256,254);
img32.setPixels(filtre16);
let win12 = new T.Window('Blob min_max filter 16 bit');
let view12 = T.view(img32.getRaster());
win12.addView(view12);
win12.addToDOM('workspace');


 // Display float32 images
 
let img02 = new T.Image('float32',256,254);
let float_blobs = blobs_pixels.map( (px) => px/128 - 1.0);
img02.setPixels(float_blobs);
let win02 = new T.Window('Blobs float32');
let view02 = T.view(img02.getRaster());
// Create the window content from the view
win02.addView(view02);
// Add the window to the DOM and display it
win02.addToDOM('workspace');



let filtre2 =min_max(img02,5,max);




//image after filtre

let img2 = new T.Image('float32',256,254);
img2.setPixels(filtre2);
let win2 = new T.Window('Blob min_max filter 32 bit');
let view2 = T.view(img2.getRaster());
win2.addView(view2);
win2.addToDOM('workspace');

// pr chaque function faire en output le T.raster au debut
// let output = T.Raster.from(img.raster,copy_mode);
