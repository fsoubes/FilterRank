
/*****************   M A I N   ***********************/

/**
 * Invert uint8 images
 */
let img0 = new T.Image('uint8',256,254);
img0.setPixels(new Uint8Array(blobs_pixels));
// img01.setPixels(new Float32Array(float32_blobs) );
let win0 = new T.Window('Blobs uint8');
let view0 = cpu.view(img0.getRaster());
// Create the window content from the view
//win0.addView(view0);
// Add the window to the DOM and display it
//win0.addToDOM('workspace');

/**
 * Invert uint16 images
 */
let img01 = new T.Image('uint16',256,254);
let uint16_blobs = blobs_pixels.map ( (px) => px * 256);
img01.setPixels(new Uint16Array(uint16_blobs) );
let win01 = new T.Window('Blobs uint16');
let view01 = cpu.view(img01.getRaster());
// Create the window content from the view
//win01.addView(view01);
// Add the window to the DOM and display it
//win01.addToDOM('workspace');

/**
 * Invert float32 images
 */
let img02 = new T.Image('float32',256,254);
let float32_blobs = blobs_pixels.map ( (px) => px / 256);
img02.setPixels(new Float32Array(float32_blobs) );
let win02 = new T.Window('Blobs float32');
let view02 = cpu.view(img02.getRaster());
win02.addView(view02);
win02.addToDOM('workspace');


// Run CPU mean 5x5 
let size = 15;
let radius = size / 2.0 - 0.5;
let kernel = cpu.convolutionKernel(
    //cpu.CPU_HARDWARE,                            // For cpu.convolve
    cpu.KERNEL_CIRCLE,                           // Circular kernel
    size,                                        // Circle contained in a squared kernel 5 x 5
    radius,                                      // Radius
    new Array(size * size)
    //Array.from({length: size * size}).fill(1.0)  // Weights 1 for every cells (unused for rank filters but mandatory for creating kernel)
);

/**
 * GPU
 */
/*
let gpuEnv01 = gpu.getGraphicsContext();
minimumFilter(img0.getRaster(),gpuEnv01,kernel);
*/

let gpuEnv02 = gpu.getGraphicsContext();

let gpuEnv03 = gpu.getGraphicsContext();

let gpuEnv04 = gpu.getGraphicsContext();
let t0,t1,t2,t3,t4,t5;
let gpuEnv01 = gpu.getGraphicsContext();

t0 = performance.now();
minimumFilter(img0.getRaster(),gpuEnv01,kernel);
t1 = performance.now();




t2 = performance.now();
minimumFilter(img01.getRaster(),gpuEnv02,kernel);
t3 = performance.now();

t4 = performance.now();
minimumFilter(img02.getRaster(),gpuEnv03,kernel);
t5 = performance.now();

document.getElementById('performance').innerHTML += (`${t1 - t0} milliseconds.</p>`);
document.getElementById('performance').innerHTML += (`${t3 - t2} milliseconds.</p>`);
document.getElementById('performance').innerHTML += (`${t5 - t4} milliseconds.</p>`);

















