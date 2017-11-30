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
 * Franck Soubès
 */

/**
 * @module rankFilters
 */

/**
 * Variance filter
 *
 * @param {TRaster} kernel - Convolution mask represented by the width wk
 and the height hk
 * @param {TRaster} img - Input image to process
 * @param {boolean} copy - Copy mode to manage memory usage
 * @return {TRaster} - Filtered Image
 *
 * @author Franck Soubès
 */

"use strict";

const variance = function (img, img2, wk,hk, copy=true) {  
    
    /**
     * Variance filter :  It will first compute the summed area table of 
     * all the pixels of img and after compute the summed squared area 
     * table of all the pixels of img2.
     * After this process the two img are then padded with 0 according to
     * the dimension of the convolution mask. 
     * Finally an algorithm based on Integral Image is applied to compute 
     * the variance.
     *
     * @param {TRaster} kernel - Convolution mask represented by the width wk
     and the height hk
     * @param {TRaster} img - Input image to process
     * @param {TRaster} img2 - Input image to process 
     * @param {boolean} copy - Copy mode to manage memory usage
     * @return {TRaster} - Filtered Image
     *
     * @author Franck Soubès
     */
    
    let output =  new T.Raster(img.type, img.width, img.height);
    let pixels = img.raster.pixelData;
    
    let output2 = new T.Raster(img2.type, img2.width , img2.height);
    let pixels2 = img2.raster.pixelData;

    let w= Math.max(output.width,output.height);
    let h = Math.max(output.height,output.width);

    let img_copy = [];
    let img_copy2 =[];

    let sum = 0;
    let arr = Array.apply(NaN, Array(w));
    let width = arr.map((i, x) => x);
    let height = arr.map((j,y)=> y);
    
    let firstintegral = width.map(x =>{
	sum = 0;
	height.map(y =>{
	    sum += pixels[x + y*w];
	    (x==0) ? img_copy[x+y*w] = sum:img_copy[x+y*w] = img_copy[(x-1)+y*w] + sum;
	});
    });
    
    let img_transformed = [];
    while(img_copy.length) img_transformed.push(img_copy.splice(0,w));
    let padd = padding(img_transformed,wk,w,h);

    let secondintegral = width.map(x =>{
	sum = 0;
	height.map(y =>{
	    sum += pixels2[x + y*w];
	    (x==0) ? img_copy2[x+y*w] = sum: img_copy2[x+y*w] = img_copy2[(x-1)+y*w] + sum;
	});
    });
    
    let img_transformed2 = [];  
    while(img_copy2.length) img_transformed2.push(img_copy2.splice(0,w));
    let padd2 = padding(img_transformed2,wk,w,h);
    
    let img_returned3 = IntegralImage(padd,w,h,wk,hk);
    let img_returned4 = IntegralImage(padd2,w,h,wk,hk);
    
    output = Variancefilter(img_returned3,img_returned4,w,h,wk,hk);    
    return output;
    
}


const padding = function(img,k,w,h){
    /**
     * Padding : Fill with 0 an image in function of the size of the kernel 
     *
     * @param {TRaster} kernel - Convolution mask represented by a single value
     * width or height of the kernel
     * @param {TRaster} img - Input image to process
     * @return {TRaster} - Padded image with 0
     *
     * @author Franck Soubès
     */
    
    let ker = ((k-1)/2) *2;
    let extremity = new Array(ker).fill(0);
    let leftrightpad = img => (extremity).concat(img).concat(extremity);
    let lenpad = img => Array.from(Array(img.length), () => 0);
    let updownpad = img => [lenpad(img[0])].concat(img).concat([lenpad(img[0])]);
    let balancedpad = img  => img.map(img => leftrightpad(img));
    let imagepadded = img => balancedpad(updownpad(img));
    let returned_image = imagepadded(img);
    
    for (let i =0 ; i<ker;i++ ){
	returned_image.push(returned_image[0]);
	returned_image.unshift(returned_image[0]);
    }
    
    return returned_image ;
}

const IntegralImage = function (array ,w,h,wk,hk){
    
    /**
     * IntegralImage : 
     *
     * @param {TRaster} kernel - Convolution mask represented by the width 'wk'
     * of the kernel and the height 'hk' of the kernel
     * @param {TRaster} array - Input image to process
     * @return {TRaster} - return an array of pixel wih computed pixels
     *
     * @author Franck Soubès
     */
    
    let arrayI =[];
    for (let x = wk-1  ;  x <= w + (wk-2) ; x++){
	for(  let y = hk-1  ; y <= h +(hk-2) ; y++){
	    
	    array[x-1][y-1] == 0 && array[x+wk-1][y-1] == 0
	    || array[x+wk-1][y+wk-1] == 0 && array[x+wk-1][y-1]== 0 && array[x+wk-1][y+wk-1] == 0
	    || array[x-1][y-1] == 0 && array[x-1][y+hk-1] == 0
	    || array[x+wk-1][y+hk-1] == 0 && array[x-1][y+hk-1] == 0
	    ? arrayI.push(0)
	    : arrayI.push(array[x-1][y-1]-array[x+wk-1][y-1]-array[x-1][y+hk-1]+array[x+wk-1][y+hk-1]); 
	}
    }
    return arrayI; // 1d
}

const Variancefilter = function (arrayI, arrayII, w, h, wk, hk) {

    /**
     * Variancefilter : simply applied the variance formula. 
     *
     * @param {TRaster} kernel - Convolution mask represented by the width 'wk'
     * of the kernel and the height 'hk' of the kernel
     * @param {TRaster} arrayI - Input image to process
     * @param {TRaster} arrayII - Input image2 to process
     * @return {TRaster} - return an array with computed variance
     *
     * @author Franck Soubès
     */
    
    let filtered=[];
    let arr = Array.apply(NaN, Array(w));
    let width = arr.map((i, x) => x);
    let height = arr.map((j,y)=>y);
   
    let firstedintegral =width.map(x =>{
	height.map(y =>{
	    filtered[x+y*w] =  (arrayII[x +y*w]/Math.pow(wk,2.00)) - Math.pow(arrayI[x+y*w]/Math.pow(wk,2.00),2.00) ;
	});
    });
    
    return filtered;
}




