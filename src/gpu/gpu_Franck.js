/*
 *  TIMES: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of TIMES
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TIMES.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */

'use script';

/* Source
https://medium.com/david-guan/webgl-and-image-filter-101-5017b290d02f
*/
/**
 * Variance filter
 *
 * @author Jean-Christophe Taveau
 * @author Franck Soubès
 */

const varianceFilter = (raster, graphContext, kernel, copy_mode = true) => {

    //Create GPU kernel
    let sizeKernel = kernel.length;
    let horizontalOffset = kernel.map((i) => i.offsetX);
    let verticalOffset = kernel.map((i) => i.offsetY);
    


    let id= 'Variance Filter';

    let src_vs = `#version 300 es
    in vec2 a_vertex;
    in vec2 a_texCoord;
    uniform vec2 u_resolution;
    out vec2 v_texCoord;
    
    void main() {
  	v_texCoord = a_texCoord;
  	vec2 clipSpace = a_vertex * u_resolution * 2.0 - 1.0;
  	gl_Position = vec4( clipSpace * vec2(1,-1), 0.0, 1.0);
    }`;

    
    const getFragmentSource = (samplerType,outVec,kernelLength,vectorType,uintType) => {
	return `#version 300 es
        #pragma debug(on)

	precision mediump usampler2D;
	precision mediump float;
	
	in vec2 v_texCoord;
	const float maxUint16 = 65535.0;
	uniform ${samplerType} u_image;
	uniform float u_horizontalOffset[${kernelLength}];
	uniform float u_verticalOffset[${kernelLength}];
	uniform float u_height;
	uniform float u_width;
	uniform ${uintType} u_kernelsize;
	out vec4 outColor;
	

	void main() {

	
 
	${vectorType} sum = ${vectorType}(0.0) ; 
	${vectorType} sum2 = ${vectorType}(0.0) ; 
	${vectorType} variance = ${vectorType}(0.0);
	    
	${uintType} one = ${uintType}(1.0);
	${uintType} zero_one = ${uintType}(0.0);
	${uintType} maxed = ${uintType}(65536.0);
	${uintType} mined = ${uintType}(15550.0);//65536.0
	
	
	${uintType} gamma = ${uintType}(15.0);
	${uintType} contrast = ${uintType}(1.0);
	${uintType} brightness = ${uintType}(0.0);
	${uintType} light = ${uintType}(0.5);
	
		
	 for (int i = 0; i < ${kernelLength}; i += 1){
	     sum +=  (texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb);
	     sum2 +=  (texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb *  texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb);
	     variance = (sum2 - (sum * sum)/ u_kernelsize)/ (u_kernelsize - one);
	     /*
	      if (variance.r <= 0.2 ) // case float 32 for boats when 0.01 only black pixels for 0.01*10 =>  pixel to 0.1

	    {
		variance.r = variance.r *50.00;
	    }
	     else
	     {
		 variance.r = 0.0 ;
	     }
	     */
	 }
	 
	    
	    outColor = vec4(${outVec},1.0 );
 	
    }`;
    }

    let samplerType = (raster.type === 'uint16') ? 'usampler2D' : 'sampler2D';
    let vectorType = (raster.type === 'uint16') ? `uvec3` : `vec3`;
    let uintType = (raster.type === 'uint16') ? `uint` : `float`;
    let outColor;

    switch (raster.type) {
    case 'uint8': outColor = `(variance.rgb)*255.0`; break;
    case 'rgba' : outColor = `variance.rgb`; break; 
    case 'uint16': outColor = `vec3(variance.r)/maxUint16`; break; // dsnt work dont know why T.T
    case 'float32': outColor = `vec3(variance.r)*55.0`; break; 
 
    }

	    	
    // Step #1: Create - compile + link - shader progra

    let the_shader = gpu.createProgram(graphContext,src_vs,getFragmentSource(samplerType,outColor, kernel.length, vectorType,uintType));

    console.log('programs done...');

    // Step #2: Create a gpu.Processor, and define geometry, attributes, texture, VAO, .., and run
    ;
    let gproc = gpu.createGPU(graphContext)
	.size(raster.width,raster.height)
	.geometry(gpu.rectangle(raster.width,raster.height))
	.attribute('a_vertex',2,'float', 16,0)      // X, Y
	.attribute('a_texCoord',2, 'float', 16, 8)  // S, T
	.texture(raster,0)
	.packWith(the_shader) // VAO
	.clearCanvas([0.0,1.0,1.0,1.0])
        .preprocess()
	.uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
	.uniform('u_image',0)
	.uniform('u_kernelsize', kernel.length)
	.uniform('u_horizontalOffset', horizontalOffset) //Ajout
	.uniform('u_verticalOffset', verticalOffset) //Ajout
	.uniform('u_height', raster.height) //Ajout
	.uniform('u_width', raster.width) //Ajout
	.run();
    
    return raster;
}

	/*
	    if (variance.r <= 0.1 ) // case float 32

	    {
		variance.r = variance.r *10.0;
	    }
	    else
	    {
		variance.r = variance.r;
	    }

	    if (variance.r < 1.0 && variance.b <1.0 && variance.g < 1.0 ) // case 8-bit

	    {
		variance.r = variance.r *255.0;
		variance.g = variance.g *255.0;
		variance.b = variance.b *255.0;
	    }
	    else
	    {
		variance.r = variance.r ;
		variance.g = variance.g ;
		variance.b = variance.b ;
	    }
		outColor = vec4(${outVec},1.0 );
	    }
	 	
		for (int i = 0; i < ${kernelLength}; i += 1){
	    
	    sum +=  (texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).r)/(maxed);
	    sum2 +=  (texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb *  texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb)/maxed;
	    variance = (sum2 - (sum * sum)/ u_kernelsize)/ (u_kernelsize - one);
		}
	
		if (variance.r < mined ) // case 16-bit

	    {
		variance.r = variance.r ;
	    }
	    else
	    {
		variance.r = zero_one;
	    }

		outColor = vec4(${outVec},1.0 );
	    
	    }
	    //variance.rgb = ((variance.rgb*gamma) - light)*contrast + brightness + light;
	    */
	    
