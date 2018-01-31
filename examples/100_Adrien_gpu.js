/**
 * Invert colors
 *
 * @author Jean-Christophe Taveau
 */


// Create an Image containing boats (from ImageJ))
let img = new T.Image('uint8',360,288);
img.setPixels(new Uint8Array(boats_pixels));

// Run CPU mean 5x5 
let size = 5;
let radius = size / 2.0 - 0.5;
let kernel5x5 = cpu.convolutionKernel(
    //cpu.CPU_HARDWARE,                            // For cpu.convolve
    cpu.KERNEL_CIRCLE,                           // Circular kernel
    size,                                        // Circle contained in a squared kernel 5 x 5
    radius,                                      // Radius
    new Array(size * size)
    //Array.from({length: size * size}).fill(1.0)  // Weights 1 for every cells (unused for rank filters but mandatory for creating kernel)
);
console.log(kernel5x5);

// Get a graphics context from canvas
let gpuEnv = gpu.getGraphicsContext();

// Run invert 
Adrien(img.getRaster(), gpuEnv, kernel5x5);
