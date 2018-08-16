"use strict";
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
 * Franck Soubès
 * Jean-Christophe Taveau
 * 
 */

/**
 * @module rankFilters
 */

/**
     * Variance filter :  It will first compute the summed area table of 
     * all the pixels wihtin the first img and after compute the summed squared area 
     * table of all the pixels within the img2.
     * After this process the two img are then padded with 0 according to
     * the dimension of the convolution mask. 
     * Finally an algorithm based on Integral Image is applied to compute 
     * the variance.
     *
     * @param {TRaster} kernel - Convolution mask represented here by a defalt value = 2
       with this algorithm the kernel doesn't have to be squared.
     * @param {TRaster} img - Input image to process 
     * @param {boolean} copy - Copy mode to manage memory usage
     * @return {TRaster} - Filtered Image
     *
     * @author Franck Soubès - Jean-Christophe Taveau 
     */


const variance = (kernel) => (img,copy_mode = true) => {
   

    let output = T.Raster.from(img,copy_mode);
    let w= img.width;
    let h = img.height;
    let wk = kernel.width;
    let img2 = new T.Image(img.type,w,h);
    let squared = img.pixelData.map((x) => x * x );
    img2.setPixels(squared);
    let imgsqr= T.Raster.from(img2.raster,copy_mode);

       
    
     /*
     	Integral Image proposed by JC.Taveau
     */

    
     output.pixelData.reduce((sum1,px,i) => {
	let x = i%w;
	sum1[x] += px;
	  output.pixelData[i] = sum1[x] + ((x == 0 ) ? 0.0 : output.pixelData[i-1])
	 return sum1;},new Float32Array(w).fill(0.0));   

    
    img2.raster.pixelData.reduce((sum1,px,i) => {
	let x = i%w;
	sum1[x] += px;
	img2.raster.pixelData[i] = sum1[x] + ((x == 0 ) ? 0.0 : img2.raster.pixelData[i-1])
	return sum1;},new Float32Array(w).fill(0.0));
    

    /*
    // another method not totally functionnal but way more faster with the use of forEach however it dsnt seem faster than the reduce
    let sum = 0;
     let arr= Array.from(Array(w), () => NaN);
    let width = arr.map((i,x) => x);
    let arr1 = Array.from(Array(h), () => NaN);
    let height = arr1.map((j,y)=>y);
    
    let firstintegral = width.forEach(x =>{
	sum = 0;
	height.forEach(y =>{
	    sum += pixels[x + y*w];
	    (x==0) ? img.pixelData[x+y*w] = sum:img.pixelData[x+y*w] = img.pixelData[(x-1)+y*w] + sum;
	});
    });

    let firstintegral2 = width.forEach(x =>{
	sum = 0;
	height.forEach(y =>{
	    sum += pixels[x + y*w];
	    (x==0) ? img2.raster.pixelData[x+y*w] = sum:img2.raster.pixelData[x+y*w] = img2.raster.pixelData[(x-1)+y*w] + sum;
	});
    });
   */
    
    getvar(padding(output,wk,w,h,false,true),padding(img2,wk,w,h,true,true),img.type,w,h,wk, true); 
 
    return output;
}


const padding = function(img,k,w,h,flag,copy_mode = true){

    /**
     * Padding : Fill with 0 an image in function of the kernel radius.
     *
     * @param {TRaster} img - Input image to process.
     * @param {TRaster} k - Convolution mask represented by a single value (width*height).
     * @param {TRaster} w - width of the image.
     * @param {TRaster} h - height of the image.
     * @param {boolean} flag - if true it will take the raster from the img and the pixelData from the raster
     * if it is false just the pixelData from the raster.
     * @param {boolean} copy - Copy mode to manage memory usage
     * @return {TRaster} - Padded image with 0 and with computed coordinates.
     * 
     * @author Franck Soubès
     */
    
    let ima ;
    if (flag){
	
	ima = img.getRaster();
	ima = ima.pixelData;
    }
    else{
	ima = img.pixelData;
    }

    let new_img = [];
    while(ima.length) new_img.push(ima.splice(0,w));
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
      
    img.pixelData = Getcoord(returned_image,w,h,k);
    return img;
}


 /**
     * Getcoord : Compute the four coordinates of the main algorithm and treat the edges.
     *
     * @param {Array} img -  Convolution mask represented by a single value
     * width*height of the kernel.
     * @param {hight} w - height of the image.
     * @param {width} h - width of the image.
     * @param {kernel} k - Convolution mask represented by a single value.
     * @return {Array} - return an array of pixel wih computed pixels.
     *
     * @author Franck Soubès
     */

const Getcoord = function (img ,w,h,k,copy_mode=false){
    
   

    let img_returned = img.reduce(function(acc,elem,x){
	if( x >= k-1 && x<= h + (k-2)){
	    computed = elem.reduce(function(acc2,elem2,y){
		if(y >= k-1 && y <= w + (k-2)){
		    img[x-1][y-1] == 0 && img[x+k-1][y-1] == 0 // left
		    || img[x+k-1][y+k-1] == 0 && img[x+k-1][y-1]== 0 && img[x+k-1][y+k-1] == 0  // down
		    || img[x-1][y-1] == 0 && img[x-1][y+k-1] == 0 // up
		    || img[x+k-1][y+k-1] == 0 && img[x-1][y+k-1] == 0 // right
		    ? acc2.push(0): acc2.push(img[x-1][y-1]-img[x+k-1][y-1]-img[x-1][y+k-1]+img[x+k-1][y+k-1]);
		}
		return acc2;
	    },[]);
	    acc.push(computed)
	}
	return acc;
    },[]);
	
    const flatten = (array) => {
	return array.reduce((acc, element) => {
	    return acc.concat(element);
	},[]);
    };
    
    img_returned2=flatten(img_returned)
    
    return img_returned2;
	
}


/**
     * Variancefilter : simply apply the variance formula. 
     *
     * @param {TRaster} img1 - Input image to process.
     * @param {TRaster} img2 - Input image to process.
     * @param {TRaster} w - width of the image.
     * @param {TRaster} h - height of the image.
     * @param {TRaster} type - Return the type of the raster (uint8, uint16, float32  or argb).
     * @param {TRaster} kernel -  Convolution mask represented by a single value
     * width*height of the kernel.
     * @return {TRaster} - return an array with computed variance.
     *
     * @author Franck Soubès
     */

const getvar = function (img, img2,type, w, h,kernel,copy_mode=true) {

    
    
    let arr= Array.from(Array(w), () => NaN);
    let width = arr.map((i,x) => x);
    let result;
    let arr1 = Array.from(Array(h), () => NaN);
    let height = arr1.map((j,y)=>y);
    let compute_variance =width.forEach(x =>{
	height.forEach(y =>{
	    
	    result =  (img2.pixelData[x +y*w]/Math.pow(kernel,2.00)) - Math.pow(img.pixelData[x+y*w]/Math.pow(kernel,2.00),2.00) ;
	    
	    result > 255 && type === "uint8" ? img.pixelData[x+y*w] = 255 
	    :result < 10000000 && type === "uint16" //arbitrary value seems good for boats and blob
	    ? img.pixelData[x+y*w] = 0 : result >  10000000 && type === "uint16"
	    ? img.pixelData[x+y*w] = 65535 : result>1 && type === "float32"
	    ? img.pixelData[x+y*w] = 1 : img.pixelData[x+y*w] = result; // because of the noise the uint16 display is not quiet good, maybe also because of the main algorithm ?
	    // when not normalizing it has blue edges and it's more clean, float 32 is ok
	});
    });
    
    return img;
}






