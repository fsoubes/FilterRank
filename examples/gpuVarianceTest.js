
/*****************   M A I N   ***********************/

let testWidthList = [360, 720, 1080, 1440,1800,2880];
let testHeightList = [ 288, 576, 864, 1152,1440,2304];
let testPixelsList = [ boats_pixels, boats_720x576, boats_1080x864,boats_1440x1152,boats_1800x1440, boats_2880x2304 ];

let indexImage = 5;
let testWidth = testWidthList[indexImage];
let testHeight = testHeightList[indexImage];
let testPixels = testPixelsList[indexImage];

/**
 * Invert uint8 images
 */
let img0 = new T.Image('uint8',testWidth,testHeight);
img0.setPixels(new Uint8Array(testPixels));
let win0 = new T.Window('Blobs uint8');
let view0 = cpu.view(img0.getRaster());
win0.addView(view0);
win0.addToDOM('workspace');

/**
 * Invert uint16 images
 */
let img01 = new T.Image('uint16',testWidth,testHeight);
let uint16_pixels = testPixels.map ( (px) => px * 256);
img01.setPixels(new Uint16Array(uint16_pixels) );
let win01 = new T.Window('Blobs uint16');
let view01 = cpu.view(img01.getRaster());
win01.addView(view01);
win01.addToDOM('workspace');

/**
 * Invert float32 images
 */
let img02 = new T.Image('float32',testWidth,testHeight);
let float32_pixels = testPixels.map ( (px) => px / 256);
img02.setPixels(new Float32Array(float32_pixels) );
let win02 = new T.Window('Blobs float32');
let view02 = cpu.view(img02.getRaster());
win02.addView(view02);
win02.addToDOM('workspace');

// Run CPU mean 5x5 
let size = 7;
let radius = size / 2.0 - 0.5;
let kernel = cpu.convolutionKernel(
    cpu.KERNEL_CIRCLE,                           // Circular kernel
    size,                                        // Circle contained in a squared kernel 5 x 5
    radius,                                      // Radius
    new Array(size * size)
);

/**
 * GPU
 */

let nbTest=1;
let rasterList =[img0.getRaster(), img01.getRaster(), img02.getRaster()];

// Test Gpu

let gpuEnv01 = gpu.getGraphicsContext('previewUint8');
let gpuEnv02 = gpu.getGraphicsContext('previewUint16');
let gpuEnv03 = gpu.getGraphicsContext('previewFloat32');
let gpuEnvList = [gpuEnv01, gpuEnv02, gpuEnv03];
var resultGpu = [];
for (let j=0; j<rasterList.length; j++){
    var t0 = performance.now();
    for (let i=0; i<nbTest; i++){	
	varianceFilter(rasterList[j],gpuEnvList[j], kernel);
    }
    var t1 = performance.now();
    resultGpu.push(((t1 - t0) / nbTest).toFixed(4));
}

/*
// Test Cpu
let varianceFilteredList = [];
var resultCpu =[];
for (let j=0; j<rasterList.length; j++){
    var t0 = performance.now();
    for (let i=0; i<nbTest; i++){	
	varianceFilteredList[j] =cpu_varianceFilter(kernel,rasterList[j]);
    }
    var t1 = performance.now();
    resultCpu.push(((t1 - t0) / nbTest).toFixed(4));
}
let win10 = new T.Window('New 8bit');
let view10 = cpu.view(varianceFilteredList[0]);
win10.addView(view10);
win10.addToDOM('workspace');
let win20 = new T.Window('New 16bit');
let win30 = new T.Window('New Float32');
let view20 = cpu.view(varianceFilteredList[1]);
let view30 = cpu.view(varianceFilteredList[2]);
win20.addView(view20);
win30.addView(view30);
win20.addToDOM('workspace');
win30.addToDOM('workspace');
*/

// Print result
for (let i=0; i<resultGpu.length; i++){
    console.log(resultGpu[i]);
}
/*
for (let i=0; i<resultCpu.length; i++){
    console.log(resultCpu[i]);
}
*/
