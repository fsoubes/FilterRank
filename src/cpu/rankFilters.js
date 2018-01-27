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


/**
 * @module rankFilters
 */
 
 /**
 * Median filter
 *
 * @param {TRaster} kernel - Convolution mask
 * @param {TRaster} img - Input image to process
 * @param {boolean} copy - Copy mode to manage memory usage
 * @return {TRaster} - Filtered Image
 *
 * @author Adrien Rohan
 */
const medianFilter = (kernel) => (image,copy=true) => {
    let outputRaster = T.Raster.from(image);    
    let radiusKernel = Math.floor(kernel.width/2);
    let diameterKernelnoCenter = radiusKernel*2;
    const flatten = (array) => {
	return array.reduce((acc, element) => {
	    return acc.concat(element);
	},[]);
    };
    //// Padding    
    let tmpArray = Array(image.height).fill(0).reduce((acc,element,index) => {
	acc[index] = Array(image.width).fill(0).reduce((acc2, element2, index2) => {
	    return acc2.concat(image.pixelData[index*image.width+index2]);
	},[]);
	return acc;
    },[]).map((element) => {
	return Array(radiusKernel).fill(element[0]).concat(element, Array(radiusKernel).fill(element[image.width-1]));
    });
    let startPaddedImage = Array(radiusKernel).fill(tmpArray[0]);
    let endPaddedImage = Array(radiusKernel).fill(tmpArray[image.height-1]);
    let paddedImage = flatten(startPaddedImage).concat(flatten(tmpArray), flatten(endPaddedImage));
    ////
    //// Traitement de l'image
    outputRaster.pixelData = Array(image.height).fill(0).reduce((acc4, element4, index4) => {
	let histogramList = Array(image.width+diameterKernelnoCenter).fill(0).reduce((acc,element) => { return acc.concat([Array(diameterKernelnoCenter+1).fill(0)]); },[]);
	paddedImage.slice(index4*(image.width+diameterKernelnoCenter),(index4+radiusKernel*2+1)*(image.width+diameterKernelnoCenter))
	    .forEach((element2, index2) => {
		histogramList[index2%(image.width+(radiusKernel)*2)][Math.floor(index2/(image.width+diameterKernelnoCenter))] = element2;
	    });
	let rowMedian = histogramList.slice(0,image.width)
	    .reduce((acc, element, index) => {
		let kernelHistogram = histogramList.slice(index,index+diameterKernelnoCenter+1)
		    .reduce((acc2, element2) => {
			return acc2.concat(element2);
		    },[]).slice().sort((a, b) => a - b);
		let median = kernelHistogram[(kernelHistogram.length-1)/2];
		return acc.concat(median);
	    },[]);
	return acc4.concat(rowMedian);
    },[]);
    return outputRaster;
}

const Two_One =function (array,copy_mode=true){
      /**
   * @author : Guillamaury Debras
   * Transform a 2D array into 1D array
   * @param {array} array - a 2D array
   * @ return {Array} newArr - a 1D Array 
   */
 var newArr = [];

for(var i = 0; i < array.length; i++)
{
    newArr = newArr.concat(array[i]);
}
 return newArr;
}


const transpose =function (array,copy_mode=true) {

          /**
   * @author : Guillamaury Debras
   * Transpose an array.
   * @param {array} array - an array
   * @ return {array} array - transposed array 
   */
    return array.reduce((prev, next) => next.map((item, i) =>
        (prev[i] || []).concat(next[i])
    ), []);
}



const remplissage =function (im,kernel,filtre,type,copy_mode=true){
  /**
   * @author : Guillamaury Debras
   * Create an array with vertical or horizontal padding depending of the paramater filtre and type.
   * It'll push specifics values to help compute the edges without cropping.
 
   
   * @param {Raster} im - an image ( can be 8bit,16bit or float 32)
   * @param {number} kernel - kernel size can be from 3 to 13
   * @param {String} filtre - type of filter ( either min or max )
   * @param {String} type - - type of padding ( either line or column)
   * @ return {Array} output - Array 
   */
      
    let finalim=[];
    let listedligne0=[];
    let listedim=[];
    let newsize = (kernel-1)*2;
    let kernelmod=kernel-1;
    let ima=  new T.Raster(im.type, im.width, im.height);   
    let output = T.Raster.from(im.raster,copy_mode);   
    let realtype = im.type;   
    let pixels = im.raster.pixelData;
    let wim = ima.width;
    let h = wim + newsize/2;
    let haut = ima.height;
    let hautc = haut+kernel-1;
    let w = haut + newsize/2;
  
    if ( type == 'lin'){
    
    for (let i=0; i<haut; i++){
        for (let i =0 ; i<h; i++){
	    
	( filtre =='max') ? listedligne0.push(-1):listedligne0=listedligne0;
	(( filtre=="min") && (realtype =="uint8")) ? listedligne0.push(255):listedligne0=listedligne0;
	((filtre=='min') && (realtype =='uint16')) ? listedligne0.push(65535):listedligne0=listedligne0;
	((filtre=='min') && (realtype =='float32')) ? listedligne0.push(1):listedligne0=listedligne0;
			    
        }
        
		for (let j=0; j<wim; j++){ 
	  	let ind = (j)+(i*wim);
 	    // création d'une liste pour la colonne désiré
		    listedim.push(pixels[ind]);}
	
    listedligne0.splice(0, wim, ...listedim);    
     finalim.push(listedligne0);
     
     listedligne0=[];
     listedim=[];
    }
	let oneliste =Two_One(finalim);	
        let output = oneliste;
	//output = setPixels(oneliste);    
      return output;
    }
    // rajout de valeurs pour avoir une image carre
    
    if ( type =='col'){
	if ( haut <= wim ) {
	    if (filtre=='min'){
		
		for ( let i=0 ; i < wim*(wim-haut+kernelmod); i++){
		    (realtype =='uint8')? pixels.push(255):pixels=pixels;
		    (realtype =='uint16')?pixels.push(65535):pixels=pixels;
		    (realtype == 'float32')?pixels.push(1):pixels=pixels;}}
	    
	    if (filtre =='max'){
		for ( let i=0 ; i < wim*(wim-haut+kernelmod); i++){
		    pixels.push(-1);
		}}}}
    return pixels;
}



const filtreligne =function (largeur,hauteur,array,kernel,filtr,copy_mode=true){
  /**
   * @author : Guillamaury Debras
   * This is the first part of the filter. It takes a padded array and compute the min or max
   * of this image depending of the kernel size. This functions only compute the min_max for each line.
   
   * @param {number} largeur - the width of the initial image
   * @param {number} hauteur - the height of the initial image
   * @param {array} array - a 1D array
   * @param {number} kernel - kernel size
   * @param {string} filtr - decide the type of filter we want ( min or max )
   * @ return {Array} output - Array 
   */
    var output=[];
    let image2=[];
    let newsize = (kernel-1);  
    let h = hauteur;
    let w1 = largeur+newsize;
    let w = largeur;
    let h1 = hauteur+newsize;
    
	for (let i=0; i<h; i++){
		for (let j=0; j<w1; j++){
	  	let ind = (j)+(i*w1);
 	    // création d'une liste pour la colonne désiré
	    image2.push(array[ind]);      
		}	      
	          
     	for( let i=0; i<image2.length-kernel+1; i++){
      let maxi = 0;
      
	    if (i<image2.length-kernel+1){
		(filtr=='max') ? output.push( kernelsize(filtr,i,image2,kernel)):output=output;
		(filtr=='min') ? output.push(kernelsize(filtr,i,image2,kernel)):output=output;
	    }
	}
      // reinitialisation de la liste dynamique
      image2 = [];      
	}
      // retours de la nouvelle liste avc valeur max pour kernel de taille 
     return output;
}



const filtrecol =function (largeur,hauteur,array,kernel,filtr,copy_mode=true){

  /**
   * @author : Guillamaury Debras
   * This is the second part of the filter. It takes a padded array and compute the min or max
   * of this image depending of the kernel size. This functions only compute the min_max for each column.
   
   * @param {number} largeur - the width of the initial image
   * @param {number} hauteur - the height of the initial image
   * @param {array} array - a 1D array
   * @param {number} kernel - kernel size
   * @param {string} filtr - decide the type of filter we want ( min or max )
   * @ return {Array} output - Array 
   */
   
    let image2=[];
    let newsize = (kernel-1);   
    let h = hauteur;
    let w1 = largeur+newsize;
    let w = largeur;
    let h1 = hauteur+newsize;   
    let finalarray = [];
    let onearray=[];

	for (let i=0; i<w; i++){
	    for (let j=0; j<h1+(w-h); j++){
	  	var ind = (i)+(j*w);	   
	    image2.push(array[ind]);}
	    
     	for( let p=0; p<image2.length-kernel+1; p++){
      let maxi = 0;

	    (p<image2.length-kernel+1) ? onearray.push(kernelsize(filtr,p,image2,kernel)):onearray=onearray;
	    
	}
	    finalarray.push(onearray);
	    onearray=[];
	    image2 = [];     
	}    
    let output1 = transpose(finalarray);
    let output2 = Two_One(output1);
    
     return output2;
}


const kernelsize =function (filtre,i,image2,kernel,copy_mode=true){
     /**
   * @author : Guillamaury Debras
   * This function is curryed into the linefilter and columnfilter to compute the min or the max 
   * depending of the kernelsize. 
    
   * @param {String} filtre - the type of the filter ( min or max)
   * @param {number} i - the current index of the loop in the filterline or filtercol function.
   * @param {Array} image2 - the image containing the values + the padded values 
   * @param {number} kernel - - kernel size 
   * @ return {number} output - the result of the min/max filter for a specific kernel size
   */
    let output = 0 ;
    
    if (filtre=="max"){	
	(kernel == 3) ?  output = Math.max(image2[i],image2[i+1],image2[i+2]):output=output;
	(kernel == 5) ?  output = Math.max(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4]):output=output;
	(kernel == 7) ?  output = Math.max(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6]):output=output;
	(kernel == 9) ?  output = Math.max(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8]):output=output;
        (kernel == 11) ?  output = Math.max(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8],image2[i+9],image2[i+10]):output=output;
	(kernel == 13) ?  output = Math.max(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8],image2[i+9],image2[i+10],image2[i+11],image2[i+12]):output=output;}

    if (filtre=="min"){
	(kernel == 3) ?  output = Math.min(image2[i],image2[i+1],image2[i+2]):output=output;
	(kernel == 5) ?  output = Math.min(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4]):output=output;
	(kernel == 7) ?  output = Math.min(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6]):output=output;
	(kernel == 9) ?  output = Math.min(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8]):output=output;
        (kernel == 11) ?  output = Math.min(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8],image2[i+9],image2[i+10]):output=output;
	(kernel == 13) ?  output = Math.min(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8],image2[i+9],image2[i+10],image2[i+11],image2[i+12]):output=output;}  
    return output;
}


const min_max =function (im,kernel,filter,copy_mode=true){
      /**
   * @author : Guillamaury Debras
   
   * This is the main function using all the other functions.
   * First, we obtain the image values into an array and padd in line this array.
   * Then we filter each padded line according to the kernelsize and returns it into 
   * an new image.
   * This linefiltered image is then padded in columns with the same padded function called
   * remplissage and we then filter in colmuns our image.
   * According to the paper we presented before, we implemented an algorithm capable of 
   * computing the min or max first in lines then in columns.
   * @param {number} largeur - the width of the initial image
   * @param {number} hauteur - the height of the initial image
   * @param {array} array - a 1D array
   * @param {number} kernel - kernel size
   * @param {string} filtr - decide the type of filter we want ( min or max )
   * @ return {Array} output - Array 
   */
    //let max = 'max';
    //let min = 'min';
    let lin = "lin";
    let col = "col";
    let image=  new T.Raster(im.type, im.width, im.height);
    let pixels = im.raster.pixelData;
    let wim = image.width;
    let hei = image.height;
    let rempli = remplissage(im,kernel,filter,lin);  
    let filtrel = filtreligne(wim,hei,rempli,kernel,filter);  
    let type = im.type;
    let imginter = new T.Image(type,wim,hei);
    imginter.setPixels(filtrel);
    let rempli2 = remplissage(imginter,kernel,filter,col);
    let filtre2 = filtrecol(wim,hei,rempli2,kernel,filter);  


    
    return filtre2;   
}

const variance = (kernel) => (img,copy_mode = true) => {
   
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

const Getcoord = function (img ,w,h,k,copy_mode=false){
    
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

    
    
    let img_returned = img.reduce(function(acc,elem,x){
	if( x >= k-1 && x<= h + (k-2)){
	    computed = elem.reduce(function(acc2,elem2,y){
		if(y >= k-1 && y <= w + (k-2)){
		    img[x-1][y-1] == 0 && img[x+k-1][y-1] == 0 ||// left
		    img[x+k-1][y+k-1] == 0 && img[x+k-1][y-1]== 0 && img[x+k-1][y+k-1] == 0 || // down
		    img[x-1][y-1] == 0 && img[x-1][y+k-1] == 0 ||// up
		    img[x+k-1][y+k-1] == 0 && img[x-1][y+k-1] == 0 // right
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

const getvar = function (img, img2,type, w, h,kernel,copy_mode=true) {

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
