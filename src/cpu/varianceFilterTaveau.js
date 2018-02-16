const cpu_varianceFilter = (kernel, raster, wrap = cpu.BORDER_CLAMP_TO_BORDER, copy_mode = true) => {
    
    // Manage clamp to border - outside: 0
    const clampBorder = (pixels,x,y,width,height) => {
	return (x >=0 && x < width && y >=0 && y < height) ? pixels[x + y * width] : 0;
    };
    
    // Manage clamp to edge - outside: value of the image edge
    const clampEdge = (pixels, x,y,width,height) => {
	let xx = Math.min(Math.max(x,0),width  - 1);
	let yy = Math.min(Math.max(y,0),height - 1);
	return pixels[xx + yy * width];
    };
    
    // Manage repeat - outside: value of the image tile (like OpenGL texture wrap mode)
    const repeat = (pixels, x,y,width,height) => {
	let xx = (width  + x ) % width;
	let yy = (height + y ) % height;
	return pixels[xx + yy * width];
    };
    
    // Manage mirror - outside: value of the image mirrored tile (like OpenGL texture wrap mode)
    // BUG
    const mirror = (pixels, x,y, width,height) => {
	// BUG
	let xx = Math.trunc(x / width) * 2 * (width  - 1)  - x;
	let yy = Math.trunc(y / height) * 2 * (height  - 1)  - y;
	return pixels[xx + yy * width];
    };
    
    let border = (wrap === cpu.BORDER_CLAMP_TO_EDGE) ? clampEdge : ( (wrap === cpu.BORDER_REPEAT) ? repeat : ( (wrap === cpu.BORDER_MIRROR) ? mirror : clampBorder));
    console.log(border);
    console.log(border.name);
    let input = raster.pixelData;
    let output =  T.Raster.from(raster,false);
    // Main 
    let width = raster.width;
    let height = raster.height;
    output.pixelData = input.map( (px, index, pixels) => {
	
	let [sum, sum2] =  kernel.reduce( (sum,v) => {
	    
	    // Get pixel value in kernel
	    let pix = border(
		pixels,
		cpu.getX(index,width) + v.offsetX, 
		cpu.getY(index,width) + v.offsetY,
		width,height);

	    // Sum
	    sum[0] += pix;
	    sum[1] += pix * pix;
	    // Square Sum
	    return sum;
	},[0.0,0.0]);
	return (sum2 - (sum * sum)/kernel.length)/(kernel.length - 1);
	/*
	let sum2 =  kernel.reduce( (sum,v) => {
	    // Get pixel value in kernel
	    let pix = border(
		pixels,
		cpu.getX(index,width) + v.offsetX, 
		cpu.getY(index,width) + v.offsetY,
		width,height);

	    // Sum
	    sum.push(pix);
	    // Square Sum
	    return sum;
	},[]);
	sum2.sort((a, b) => a - b);
	return sum2[sum2.length/2-0.5];*/
    });


    // Normalize image?
    cpu.statistics(output);
    console.log(output.statistics);
    return output;
}
