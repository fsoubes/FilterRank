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
 * Invert colors
 *
 * @author Jean-Christophe Taveau
 */

const varianceFilter = (raster, graphContext, kernel, copy_mode = true) => {

    //Create GPU kernel
    let sizeKernel = kernel.length;
    let horizontalOffset = kernel.map((i) => i.offsetX);
    let verticalOffset = kernel.map((i) => i.offsetY);


    let id= 'Franck';

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



    let src_fs = `#version 300 es
    precision mediump float;
    //precision highp float;
    in vec2 v_texCoord;
    uniform sampler2D u_image;
    uniform float u_kernelsize;
    uniform int u_sizeKernel;
    uniform float u_horizontalOffset[1000];
    uniform float u_verticalOffset[1000];
    uniform float u_height;
    uniform float u_width;
    out vec4 outColor;
    void main() {
      /*
	float variance(vec3 kernelContent,float u_kernelsize)
	{
	vec3 sum = vec3(0.0);
	vec3 sum2 = vec3(0.0);
	float mean ;
	for (int i =0 <u_sizeKernel; i+=1)
	{
	    sum += kernelContent[i].rgb;
	}
	mean = sum/u_kernelsize ;
	for (int j = 0 < u_sizeKernel; j+=1)
	{
	    sum2 += (kernelContent[j].rgb - mean)*(kernelContent[j] - mean);
	}
	variance = sum2/(u_kernelsize -1.0);
	return variance;
	}
    */
	// Second essai
	vec3 kernelContent[75];
	vec3 sum  = vec3(0.0);
	vec3 sum2 = vec3(0.0);
	vec3 mean = vec3(0.0);
	vec3 variance = vec3(0.0);;
	vec3 normal ;
	for (int i = 0; i < u_sizeKernel; i += 1){
	    //normal=  texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb;
	    sum +=  texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb;
	    //mean = sum/u_kernelsize ;
	    sum2 +=  texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb *  texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb ;
	    variance = (sum2 - (sum * sum)/ u_kernelsize)*255.00;
	}
	//outColor = vec4(normal,1.0);
	//outColor = vec4(mean, 1.0);
	outColor = vec4(variance/(u_kernelsize - 1.0),1.0);
    }`;



    // Step #1: Create - compile + link - shader program
    let the_shader = gpu.createProgram(graphContext,src_vs,src_fs);

    console.log('programs done...');

    // Step #2: Create a gpu.Processor, and define geometry, attributes, texture, VAO, .., and run
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
	.uniform('u_sizeKernel', kernel.length)
	.uniform('u_horizontalOffset', horizontalOffset) //Ajout
	.uniform('u_verticalOffset', verticalOffset) //Ajout
	.uniform('u_height', raster.height) //Ajout
	.uniform('u_width', raster.width) //Ajout
	.run();
    console.log(raster);

    return raster;
}
