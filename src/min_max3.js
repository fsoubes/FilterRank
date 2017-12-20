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
 * Guillamaury Debras
 */

/**
 * @module rankFilters
 */


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
