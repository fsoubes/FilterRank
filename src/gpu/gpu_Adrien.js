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
   https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html#toc
   http://learnwebgl.brown37.net/rendering/buffer_object_primer.html
   http://www.falloutsoftware.com/tutorials/gl/webgl-1.htm
   https://www.john-smith.me/hassles-with-array-access-in-webgl-and-a-couple-of-workarounds.html
   https://stackoverflow.com/questions/9046643/webgl-create-texture
// implementation du bubblesort
   https://en.wikibooks.org/wiki/Algorithm_Implementation/Sorting/Bubble_sort#Why_is_it_called_a_bubble_sort?
*/
/**
 * Invert colors
 *
 * @author Jean-Christophe Taveau
 */

const Adrien = (raster, graphContext, kernel, copy_mode = true) => {

    //Create GPU kernel
    let horizontalOffset = new Float32Array(kernel.length);
    let verticalOffset = new Float32Array(kernel.length);
    for (let i=0; i<kernel.length; i++){
	horizontalOffset[i]=kernel[i].offsetX;
	verticalOffset[i]=kernel[i].offsetY;
    }
    console.log("horizontalOffset : ",horizontalOffset);
    console.log("verticalOffset : ",verticalOffset);
    //

    let id='Adrien';
    
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
    
	in vec2 v_texCoord;
	in vec2 v_kernelOffset; //Ajout
    uniform sampler2D u_image;
    uniform int u_sizeKernel;
    uniform float u_horizontalOffset[500];
    uniform float u_verticalOffset[500];
    uniform float u_height;
    uniform float u_width;    

    out vec4 outColor;
    
    void main() {
	// Second essai
	int median = u_sizeKernel/2;
	float testArray[50];
	vec3 kernelContent[50];
	for (int i = 0; i < u_sizeKernel; i=i+1){
	    kernelContent[i] = texture(u_image, vec2(v_texCoord.x + u_horizontalOffset[i] / u_width, v_texCoord.y + u_verticalOffset[i] / u_height)).rgb;
	}
	//bubbleSort
	int i, j;
	vec3 temp;	
	for (i = 0; i < u_sizeKernel; i++){
            for (j = 0; j < u_sizeKernel - 1; j++){
		if (kernelContent[j + 1].r + kernelContent[j + 1].g + kernelContent[j + 1].b < kernelContent[j].r + kernelContent[j].g + kernelContent[j].b){
                    temp = kernelContent[j].rgb;
                    kernelContent[j].rgb = kernelContent[j + 1].rgb;
                    kernelContent[j + 1].rgb = temp;
		}
            }
	}
	//
	outColor = vec4(kernelContent[median].rgb, 1.0);
	//outColor = vec4(texture(u_image, v_texCoord).rgb, 1.0);
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
	.uniform('u_sizeKernel', kernel.length) //Ajout
	.uniform('u_horizontalOffset', horizontalOffset) //Ajout
	.uniform('u_verticalOffset', verticalOffset) //Ajout
	.uniform('u_height', raster.height) //Ajout
	.uniform('u_width', raster.width) //Ajout
	.run();
    
    return raster;
}

//export {Adrien};



