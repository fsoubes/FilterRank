/**
 * Rank Filters Test
 *
 * @author Jean-Christophe Taveau
 */
'use script';

////////////////////////////////
//   R A N K   F I L T E R S
////////////////////////////////
[
  {name: 'Variance',size: 3, size_or_radius: 1, type: cpu.KERNEL_CIRCLE, filter: cpu.varianceFilter},
  {name: 'Minimum',size: 7, size_or_radius: 7, type: cpu.KERNEL_SQUARE, filter: cpu.minimumFilter},
  {name: 'Maximum',size: 7, size_or_radius: 7, type: cpu.KERNEL_SQUARE, filter: cpu.maximumFilter},
  {name: 'Maximum',size: 7, size_or_radius: 1, type: cpu.KERNEL_RECTANGLE, filter: cpu.maximumFilter},
  {name: 'Median',size: 7, size_or_radius: 7, type: cpu.KERNEL_RECTANGLE, filter: cpu.medianFilter}
].forEach( (param,i) => {
  // Declare some variables
  let t0, t1;

  // Create an Image containing boats (from ImageJ))
  let img = new T.Image('uint8',360,288);
    img.setPixels(new Uint8Array(boats_pixels));

    let img2 = new T.Image('uint16',360,288);
    let uint16_boats = boats_pixels.map ( (px) => px * 256);
    img2.setPixels(new Uint16Array(uint16_boats));

    let img3 = new T.Image('float32',360,288);
    let float_boats = boats_pixels.map( (px) => px/128 - 1.0);
    img3.setPixels(new Uint32Array(float_boats));

    

  // Log
  let title = `${param.name} ${param.size}x${param.size}`;
  title += (param.type === cpu.KERNEL_CIRCLE) ? ` - Radius: ${param.size_or_radius}` : '';
  title  = (param.type === cpu.KERNEL_RECTANGLE) ? `${param.name} ${param.size}x${param.size_or_radius}` : title;

  // Define kernel
  let size = 3 ;
    //let radius = size / 2.0 - 0.5;
    let radius = size;
  let kernel = cpu.convolutionKernel(
      //cpu.KERNEL_CIRCLE,
      cpu.KERNEL_SQUARE ,                   // Circular or square kernel
    size,                          // kernel width - Square size kernel 5 x 5
    radius,                        // kernel height or radius depending of the kernel type
    new Array(size * size)         // Weights. Unused for rank filters but mandatory for creating kernel.
  );

  // Define worflow
   let workflow = cpu.pipe(cpu.varianceFilter(kernel, cpu.BORDER_REPEAT), cpu.view);
  // Run workflow
   // t0 = performance.now();
  let view = workflow(img.getRaster());
  //t1 = performance.now();
  //document.getElementById('performance').innerHTML += (`<p>Perf. ${title} = ${t1 - t0} milliseconds.</p>`);

  // Create the window content from the view
  let win = new T.Window(title);
  win.addView(view);
  // Add the window to the DOM and display it
  win.addToDOM('workspace');

});


