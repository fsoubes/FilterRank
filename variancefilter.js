"use strict"

/*
  Variance Filter ~ Franck Soubès 
*/



const SAT = function (array ,w, h){  

	/** 
	function made by Franck Soubès
 	compute the SAT (summed area table) from an array in 1D
  	take 3 arguments (array list, width of they array and 
    	height of this same array)
  	and return the SAT array  
  	*/
  
    let arrayout = [] ;
    let arraygoodorder =[];
    
    for (let i = 0 ; i < w ; i++){
	let sum = 0 ; // for each new lines sum =0  
	for (let j = 0 ; j < h ; j++){
    	    const ind = (i) +(j*w)        ; // index for 1D 
    	    sum = sum + array[ind] ;
	    if (i === 0) {
      		array[ind] = sum;
		arrayout.push(array[ind]);
	    }
	    else{
      		array[ind] = array[ind-1] + sum;
		arrayout.push(array[ind]);
      	}
      } 
    }
    
    for (let x = 0 ; x<w; x++){
	for (let y=0 ; y< h; y++){
	    const ind = (x) +(y*w)
	    arraygoodorder.push(arrayout[ind]);
	    
	}
    }
    
   return arraygoodorder; 
}	
  

  
const transform2 = function (array1d, w){

	/**
  	function made by Franck Soubès
    	return an 2D array from a 1D array
    	argument (array to transform and width of the image/array)   
  	*/
    
    let array2d = [];
    while(array1d.length) array2d.push(array1d.splice(0,w));
    return array2d ;
    
}


const padded = function(array,k){
    /**

     */
    
    const ker = ((k-1)/2) *2;
    let extremity = new Array(ker).fill(0);
    let leftrightpad = array => (extremity).concat(array).concat(extremity);
    let lenpad = array => Array.from(Array(ker+2), () => 0);
    let updownpad = array => [lenpad(array[0]) ].concat(array).concat([lenpad(array[0])]);
    let balancepad = array  => array.map(array => leftrightpad(array));
    let imagepadded = array => balancepad(updownpad(array));
    let returned_image = imagepadded(array);
    console.log(returned_image);
    let returned = new Array(returned_image.length+(ker-1)) => (returned_image[O]).concat(returned_image).concat(returned_image[0]);
    console.log(returned);
								  
    for (let i =0 ; i<ker-1;i++ ){
	returned_image.push(returned_image[0]);
	returned_image.unshift(returned_image[0]);
    }
    
    return returned_image ;
}



//let J = toast(beforeArray,7);
//console.log(J);



const Imgfirst = function (array ,w,h,wk,hk){

	/**
  	function made by Franck Soubès
	return an array with computed values I in function of the array in argument
	arguments (array to transform, width of the image, height of the image, 
	width of the kernel and height of the kernel)
  	*/
  
    let arrayI =[];
    for (let x = 2;  x <= w +1  ; x++){
	for( let y =2 ; y <= h +1 ; y++){
	    const A = (array[x-1][y-1]);
	    //console.log(A);
	    const B = (array[x+wk-1][y-1]);
	    //console.log(B); 
	    const C = (array[x-1][y+hk-1]);
	    //console.log(C);
	    const D = (array[x+wk-1][y+wk-1]);
	    //console.log(D);
      	    let I = Math.abs(A - B - C + D);       
            arrayI.push(I);      
      }
    }
  return arrayI; // 1d
}


const Variancefilter = function (arrayI, arrayII, w, h,wk,hk) {
	
  /*
    function made by Franck Soubès
    return an array with computed variance for a kernel defined by wk hk
    arguments(array containing values with I' and array containing values with I", width of the image and height of the image)
  */
    let filtered=[] ;
    for (let x =0 ; x< w ; x++) {
	for (let y =0; y< h ; y++) {
	    let ind = (y) +(x*w);
	    let compute = (arrayII[ind]/Math.pow(wk,2.0)) - Math.pow(arrayI[ind]/Math.pow(wk,2.0),2.0) ;
       	    filtered.push(compute) ;   
    }  
  }	  
  return filtered;	   
}

// MAIN


let Img = [5,2,5,2,3,6,3,6,5,2,5,2,3,6,3,6]; //4x4
let Img2 = Img.map((x) => x * x ); //  (4*4)²



const w = 4;
const h=4;
const wk=3;
const hk=3; 


let ImgI = SAT(Img,w,h);
let ImgII = SAT(Img2,w,h);
ImgII = transform2(ImgII,w);
ImgI = transform2(ImgI,w);
ImgI = padded(ImgI,wk);
ImgII =padded(ImgII,wk);
console.log(ImgI);
console.log(ImgII);


/*
ImgI = Imgfirst(ImgI,w,h,wk,hk); // OK 
ImgII = Imgfirst(ImgII,w,h,wk,hk); //OK
console.log(ImgI);
console.log(ImgII);
let applied = Variancefilter(ImgI,ImgII,w,h,wk,hk);
console.log(applied);


let testreal2 = transform2(test2,8);
let testreal = transform2(test1,8)

let Img6 = Imgfirst(testreal2,w,h,wk,hk); // OK 
let Img5 = Imgfirst(testreal,w,h,wk,hk); // OK

console.log(Img5);
console.log(Img6)

let applied = Variancefilter(Img5,Img6,w,h,wk,hk);
console.log(applied);
*/


