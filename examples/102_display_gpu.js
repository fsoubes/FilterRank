/**
 * Invert colors
 *
 * @author Jean-Christophe Taveau
 */
 
// Create an Image containing boats (from ImageJ))
let img = new T.Image('uint8',360,288);
img.setPixels(new Uint8Array(boats_pixels));

let img2 = new T.Image('uint16',360,288);
let uint16_boats = boats_pixels.map ( (px) => px * 256);
img2.setPixels(new Uint16Array(uint16_boats));
console.log(img2.getRaster());

let img3 = new T.Image('float32',360,288);
let float_boats = boats_pixels.map( (px) => px/128 - 1.0);
img3.setPixels(new Float32Array(float_boats));
console.log(img3.getRaster());

// Get a graphics context from canvas
let gpuEnv = gpu.getGraphicsContext();

// Run invert 
display(img.getRaster(),gpuEnv);
