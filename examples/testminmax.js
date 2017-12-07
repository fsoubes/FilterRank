const max = 'max';
const min = 'min';

// image de base
let img0 = new T.Image('uint8',360,288);

img0.setPixels(boats_pixels);
let win0 = new T.Window('Blob');
let view0 = T.view(img0.getRaster());
win0.addView(view0);
win0.addToDOM('workspace');

/**
// operation filtre
let rempli = remplissage(img0,9,min,"lin");
let filtrel = filtreligne(360,288,rempli,9,min);
let imginter = new T.Image('uint8',360,288);
imginter.setPixels(filtrel);
let rempli2 = remplissage(imginter,9,min,"col");
let filtre2 = filtrecol(360,288,rempli2,9,min);
//let output = transpose(filtre2);
//let output2 = transpose(output);
//let output22 = Two_One(output2);

console.log(rempli);
console.log(filtrel);
console.log(rempli2);
console.log("filtrecol",filtre2);
//console.log("transpose",output);
*/
let filtre2 =min_max(img0,5,min);

//image after filtre

let img2 = new T.Image('uint8',360,288);
img2.setPixels(filtre2);
let win2 = new T.Window('Blob min_max filter');
let view2 = T.view(img2.getRaster());
win2.addView(view2);
win2.addToDOM('workspace');

// pr chaque function faire en output le T.raster au debut
// let output = T.Raster.from(raster,copy_mode);
