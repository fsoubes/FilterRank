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


/**
 * Variance filter
 *
 * @author Jean-Christophe Taveau
 * @author Franck Soubès
 */

//const gpuEdgeCanny = (low_thr,high_thr) => (raster, graphContext, kernel, copy_mode = true) => {
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

    
    const getFragmentSource = (samplerType,outVec,kernelLength,vectorType,uintType,is8,is16,isfloat) => {
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
	${uintType} formax8 = ${uintType}(255.0);
	${uintType} zero_one = ${uintType}(0.0);
	${uintType} forfloat32 = ${uintType}(50.0);

	    	
	 for (int i = 0; i < ${kernelLength}; i += 1){
	     sum +=  (texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb);
	     sum2 +=  (texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb *  texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb);
	     variance = (sum2 - (sum * sum)/ u_kernelsize)/ (u_kernelsize - one);
	 }
	 	    
	    
	    if(${is8} == true){
		
		 if (variance.r*formax8 > formax8 && variance.b*formax8 > formax8 && variance.g*formax8 > formax8 ) // case 8-bit

	    {
		variance.r = formax8;
		variance.g = formax8;
		variance.b = formax8;
	    }
	    else
	    {
		variance.r = variance.r*formax8 ;
		variance.g = variance.g *formax8;
		variance.b = variance.b *formax8 ;

	    }
		outColor = vec4(${outVec},one );
	    }
	    if (${is16} == true){
		outColor = vec4(${outVec},1.0 );}

	    
	    if(${isfloat} == true){

		if (variance.r*forfloat32 >= one ) // case float 32

		{
		variance.r = one;
		}
		else
		{
		 variance.r = variance.r*forfloat32;
		}		
		outColor = vec4(${outVec},1.0 );}
 	
    }`;
    }

    let samplerType = (raster.type === 'uint16') ? 'usampler2D' : 'sampler2D';
    let vectorType = (raster.type === 'uint16') ? `uvec3` : `vec3`;
    let uintType = (raster.type === 'uint16') ? `uint` : `float`;
    let outColor;
    let is8 = (raster.type === 'uint8') ? true : false ;
    let is16 = (raster.type === 'uint16') ? true : false ;
    let isfloat = (raster.type === 'float32') ? true : false ;

    switch (raster.type) {
    case 'uint8': outColor = `(variance.rgb)`; break;
    case 'rgba' : outColor = `variance.rgb`; break; 
    case 'uint16': outColor = `vec3(variance.r)/maxUint16`; break; // dsnt work dont know why T.T
    case 'float32': outColor = `vec3(variance.r)`; break; 
 
    }

	    	
    // Step #1: Create - compile + link - shader progra

    let the_shader = gpu.createProgram(graphContext,src_vs,getFragmentSource(samplerType,outColor, kernel.length, vectorType,uintType,is8,is16,isfloat));

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
    //return raster;
    //NON MAXIMUM SUPPRESSION, DOUBLE THRESHOLD Proposed by Cécilia Ostertag   
  let outColor_nonmax;
  let texCoord;
  let n1;
  let n2;
  switch (raster.type) {
    case 'uint8': 
    {
    	texCoord=`texture(u_image, v_texCoord)`;
    	n1=`texture(u_image, v_texCoord + (neighDir * vec2(stepSizeX,stepSizeY)))`;
    	n2=`texture(u_image, v_texCoord - (neighDir * vec2(stepSizeX,stepSizeY)))`;
    	break;
    }
    case 'rgba' : outColor_blurV = `texture(u_image, v_texCoord).rgb`; break; 
    case 'uint16': 
    {
    	texCoord=`vec4(float(texture(u_image, v_texCoord)))`;
    	n1=`vec4(float(texture(u_image, v_texCoord + (neighDir * vec2(stepSizeX,stepSizeY)))))`;
    	n2=`vec4(float(texture(u_image, v_texCoord - (neighDir * vec2(stepSizeX,stepSizeY)))))`;
    	break;
    }
    case 'float32':
    {
    	texCoord=`texture(u_image, v_texCoord)`;
    	n1=`texture(u_image, v_texCoord + (neighDir * vec2(stepSizeX,stepSizeY)))`;
    	n2=`texture(u_image, v_texCoord - (neighDir * vec2(stepSizeX,stepSizeY)))`;
    	break;
    }
  }
  
  const getFragmentSource_nonmax = (samplerType,outVec,stepSizeX,stepSizeY,texCoord,n1,n2) => {
    return `#version 300 es
    #pragma debug(on)
    precision mediump usampler2D;
    precision mediump float;
    
    in vec2 v_texCoord;
    const float maxUint16 = 65535.0;
    uniform ${samplerType} u_image;
    uniform vec2 threshold;
    
    out vec4 outColor;
    
    void main() {
    
    	float stepSizeX = float(${stepSizeX});
    	float stepSizeY = float(${stepSizeY});
		vec4 texCoord = vec4(${texCoord});
		vec2 neighDir = texCoord.gb * 2.0 - vec2(1.0);
		vec4 n1 = vec4(${n1}); //grad of neighboring pixel in grad direction
		vec4 n2 = vec4(${n2}); //grad of opposite neighboring pixel in grad direction
		
		float edgeStrength = texCoord.r * step(max(n1.r,n2.r), texCoord.r); // step returns 0 if grad is not a maximum , returns 1 if grad is a maximum, then multiplied by grad of the current pixel
		outColor = vec4(smoothstep(threshold.s, threshold.t, edgeStrength),0.0,0.0,1.0); //returns a value between 0 and 1 if grad is between low thr and high thr
		
    }`;
  }

let shader_nonmax = gpu.createProgram(graphContext,src_vs,getFragmentSource_nonmax(samplerType,outColor_nonmax,stepSizeX,stepSizeY,texCoord,n1,n2));   
    
    let gproc_nonmax = gpu.createGPU(graphContext,raster.width,raster.height)
    .size(raster.width,raster.height)
    .geometry(gpu.rectangle(raster.width,raster.height))
    .attribute('a_vertex',2,'float', 16,0)      // X, Y
    .attribute('a_texCoord',2, 'float', 16, 8)  // S, T
    .texture(gproc_sobel.framebuffers['fbo1'])
    .redirectTo('fbo2','float32',0)
    .packWith(shader_nonmax) // VAO
    .clearCanvas([0.0,1.0,1.0,1.0])
    .preprocess()
    .uniform('u_resolution',new Float32Array([1.0/raster.width,1.0/raster.height]))
    .uniform('u_image',0)
    .uniform('threshold', new Float32Array([low_thr/255.0,high_thr/255.0]))
    .run(); 
    
    console.log('non maximum suppression done...');
    return raster;
}
*/

