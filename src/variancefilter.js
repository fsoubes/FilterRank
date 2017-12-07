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
 * 
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

const variance = function (img, img2, kernel = 2, copy=true) {  
    
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
    let wk = kernel;
    let hk = wk ;
    let img_copy = [];
    let img_copy2 =[];

    let sum = 0;
    let arr= Array.from(Array(w), () => NaN);
    let width = arr.map((i,x) => x);
    let height = arr.map((j,y)=> y);
    
    let firstintegral = width.forEach(x =>{
	sum = 0;
	height.forEach(y =>{
	    sum += pixels[x + y*w];
	    (x==0) ? img_copy[x+y*w] = sum:img_copy[x+y*w] = img_copy[(x-1)+y*w] + sum;
	});
    });
    
    let padd = padding(img_copy,wk,w,h);
    
    let secondintegral = width.forEach(x =>{
	sum = 0;
	height.forEach(y =>{
	    sum += pixels2[x + y*w];
	    (x==0) ? img_copy2[x+y*w] = sum: img_copy2[x+y*w] = img_copy2[(x-1)+y*w] + sum;
	});
    });

    /*
    let integral = [];
    img.raster.pixelData.reduce((sum1,px,i) => {
	let x = i%w;
	sum1[x] += px;
	integral[i] = sum1[x] + ((x === 0 ) ? 0.0 : integral(i-1))
	
	return sum1;},new Float32Array(w).fill(0.0));
    */
    
    let padd2 = padding(img_copy2,wk,w,h);
    output = Variancefilter(padd,padd2,w,h); 
    return output;
    
}


const padding = function(img,k,w,h,copy = false){
    /**
     * Padding : Fill with 0 an image in function of the kernel radius
     *
     * @param {TRaster} kernel - Convolution mask represented by a single value
     * width or height of the kernel
     * @param {TRaster} img - Input image to process
     * @return {TRaster} - Padded image with 0
     *
     * @author Franck Soubès
     */

    let new_img = [];
    while(img.length) new_img.push(img.splice(0,w));
    let ker = ((k-1)/2) *2;
    let extremity = new Array(ker).fill(0);
    let leftrightpad = new_img => (extremity).concat(new_img).concat(extremity);
    let lenpad = new_img => Array.from(Array(new_img.length), () => 0);
    let updownpad = new_img => [lenpad(new_img[0])].concat(new_img).concat([lenpad(new_img[0])]);
    let balancedpad = new_img  => new_img.map(new_img => leftrightpad(new_img));
    let imagepadded = new_img => balancedpad(updownpad(new_img));
    let returned_image = imagepadded(new_img);
    
    for (let i =0 ; i<ker;i++ ){
	returned_image.push(returned_image[0]);
	returned_image.unshift(returned_image[0]);
    }
    
    return IntegralImage(returned_image,w,h,k) ;
}

const IntegralImage = function (img ,w,h,k,copy=false){
    
    /**
     * IntegralImage : 
     *
     * @param {TRaster} kernel - Convolution mask represented by the width 'wk'
     * of the kernel and the height 'hk' of the kernel
     * @param {TRaster} img - Input image to process
     * @return {TRaster} - return an array of pixel wih computed pixels
     *
     * @author Franck Soubès
     */
    
    let arrayI =[];
    
    for (let x = k-1  ;  x <= w + (k-2) ; x++){
	for(  let y = k-1  ; y <= h +(k-2) ; y++){
	    
	    img[x-1][y-1] == 0 && img[x+k-1][y-1] == 0
	    || img[x+k-1][y+k-1] == 0 && img[x+k-1][y-1]== 0 && img[x+k-1][y+k-1] == 0
	    || img[x-1][y-1] == 0 && img[x-1][y+k-1] == 0
	    || img[x+k-1][y+k-1] == 0 && img[x-1][y+k-1] == 0
	    ? arrayI.push(0)
	    : arrayI.push(img[x-1][y-1]-img[x+k-1][y-1]-img[x-1][y+k-1]+img[x+k-1][y+k-1]); 
	}
    }
    return arrayI; // 1d
}

const Variancefilter = function (imgI, imgII, w, h, copy=false) {

    /**
     * Variancefilter : simply applied the variance formula. 
     *
     * @param {TRaster} imgI - Input image to process
     * @param {TRaster} imgII - Input image2 to process
     * @return {TRaster} - return an array with computed variance
     *
     * @author Franck Soubès
     */
    
    let filtered=[];
    let arr= Array.from(Array(w), () => NaN);
    let width = arr.map((i,x) => x);
    let height = arr.map((j,y)=>y);
   
    let compute_variance =width.map(x =>{
	height.map(y =>{
	    filtered[x+y*w] =  (imgII[x +y*w]/Math.pow(wk,2.00)) - Math.pow(imgI[x+y*w]/Math.pow(wk,2.00),2.00) ;
	});
    });
    
    return filtered;
}




