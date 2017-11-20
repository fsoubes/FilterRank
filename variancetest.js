"use strict"

/*
  Variance Filter ~ Franck Soubès 
*/

const SAT = function (img , copy =true){  

	/** 
	function made by Franck Soubès
 	compute the SAT (summed area table) from an array in 1D
  	take 3 arguments (array list, width of they array and 
    	height of this same array)
  	and return the SAT array  
  	*/

    let w = img.width;
    let h = img.height;
    
    let img_copy = [];
    
    for (let i = 0 ; i < w ; i++){
	let sum = 0 ; // for each new lines sum =0
	for (let j = 0 ; j < h ; j++){
	    let ind = (i) +(j*w); // index for 1D
    	    sum = sum + img.pixelData[ind] ;
	    if (i === 0) {
      		img.pixelData[ind] = sum;
		img_copy[ind] = img.pixelData[ind];
	    }
	    else{
      		img.pixelData[ind] = img.pixelData[ind-1] + sum;
		img_copy[ind] = img.pixelData[ind];

      	    }
	}
    }
    
   return img_copy; 
}

  
const transform1to2 = function (img,img2,wk,hk, copy=true){

	/**
  	function made by Franck Soubès
    	return an 2D array from a 1D array
    	argument (array to transform and width of the image/array)   
  	*/
    
    let w = img.width ;
    let h = img.height;
    let w1 = img2.width;
    let h1 = img2.height;
    let img_transformed = [];
    let img_copy=[];
    
    for (let i = 0 ; i < w ; i++){
	for (let j = 0 ; j < h ; j++){
	    let ind = (j) +(i*w); // index for 1D
	    img_copy[ind] = img.pixelData[ind];    			    
	}
    }
    
    while(img_copy.length) img_transformed.push(img_copy.splice(0,8));
    
    let img_returned = Imgfirst(img_transformed,w1,h1,wk,hk);
    return img_returned;
    
}

const Imgfirst = function (array ,w,h,wk,hk){

	/**
  	function made by Franck Soubès
	return an array with computed values I in function of the array in argument
	arguments (array to transform, width of the image, height of the image, 
	width of the kernel and height of the kernel)
  	*/
  
    let arrayI =[];
    
    for (let x = wk-1 ;  x <= w +1  ; x++){
	for(  let y = hk-1 ; y <= h +1 ; y++){
	    
	    if ( array[x-1][y-1] == 0 && array[x+wk-1][y-1] == 0)
	    {
		arrayI.push(0);
	    }
	    else if ( array[x+wk-1][y+wk-1] == 0 && array[x+wk-1][y-1] == 0 && array[x+wk-1][y+wk-1] == 0){
		
		arrayI.push(0);
	    }
	    else if ( array[x-1][y-1] == 0 && array[x-1][y+hk-1] == 0){
		
		arrayI.push(0);
	    }
  	    else if ( array[x+wk-1][y+hk-1] == 0 && array[x-1][y+hk-1] == 0){
		
		arrayI.push(0);
	    }
	    else{
		
		let A = (array[x-1][y-1]);	    
		let B = (array[x+wk-1][y-1]);
		let C = (array[x-1][y+hk-1]); 
		let D = (array[x+wk-1][y+hk-1]);
      		let I = Math.abs(A - B - C + D);  
		arrayI.push(I);      
	    }	
	}
    }
  return arrayI; // 1d
}


const padded = function(array,k){
    /**

     */
    let extremity =[];
    const ker = ((k-1)/2) *2;
    
    for (let j=0; j<ker;j++){
	extremity.push(0);  	
    }
    
    let leftrightpad = array => (extremity).concat(array).concat(extremity);
    let lenpad = array => Array.from(Array(ker+2), () => 0);
    let updownpad = array => [lenpad(array[0]) ].concat(array).concat([lenpad(array[0])]);
    let balancepad = array  => array.map(array => leftrightpad(array));
    let imagepadded = array => balancepad(updownpad(array));
    let returned_image = imagepadded(array);

    for (let i =0 ; i<ker-1;i++ ){
	returned_image.push(returned_image[0]);
	returned_image.unshift(returned_image[0]);
    }
    
    return returned_image ;
}



const Variancefilter = function (img, img2,wk,hk, copy=true) {
	
  /*
    function made by Franck Soubès
    return an array with computed variance for a kernel defined by wk hk
    arguments(array containing values with I' and array containing values with I", width of the image and height of the image)
  */

    let w= 4;
    let h=4;    
    let filtered=[] ;
    for (let x =0 ; x< w ; x++) {
	for (let y =0; y< h ; y++) {
	    let ind = (y) +(x*w);
	    let compute = (img2.pixelData[ind]/Math.pow(wk,2.0)) - Math.pow(img.pixelData[ind]/Math.pow(wk,2.0),2.0) ;
       	    filtered.push(compute) ;   
    }  
  }	  
  return filtered;	   
}

// MAIN


let test2 = [	0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,25,29,54,58,0,0,
		0,0,34,74,108,148,0,0,
		0,0,59,103,162,206,0,0,
		0,0,68,148,216,296,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0];
              
let test1 = [	0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,
		0,0,5,7,12,14,0,0,
		0,0,8,16,24,32,0,0,
		0,0,13,23,36,46,0,0,
		0,0,16,32,48,64,0,0,
		0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0];

let img = new Image();
let img2 = new Image();
let imgtest = new Image();
let imgtest1 = new Image();

imgtest.pixelData = test1;
imgtest1.pixelData= test2;
img.pixelData = [5,2,5,2,3,6,3,6,5,2,5,2,3,6,3,6]; //4x4
//img2.pixelData = img.map((x) => x * x ); //  (4*4)²

img.width = 4;
img.height = 4;

const wk=3;
const hk=3; 

let ImgI = SAT(img);
//let ImgII = SAT(img2);
//ImgI = transform1to2(img);
//console.log(ImgI);
//ImgII = transform2(ImgII,w);
//img.pixelData = transform2(img);
//ImgI = padded(ImgI,wk);
//ImgII =padded(ImgII,wk);
//ImgI = Imgfirst(ImgI,w,h,wk,hk); // OK 
//ImgII = Imgfirst(ImgII,w,h,wk,hk); //OK
//let applied = Variancefilter(ImgI,ImgII,w,h,wk,hk);
//console.log(applied);

imgtest.width= 8;
imgtest.height=8;

imgtest1.width= 8;
imgtest1.height=8;


let Imgtest = new Image();
let Imgtest2 = new Image();


Imgtest = transform1to2(imgtest,img,wk,hk);
Imgtest2 = transform1to2(imgtest1,img,wk,hk);
console.log(Imgtest);

Imgtest.pixelData = transform1to2(imgtest,img,wk,hk);
Imgtest2.pixelData = transform1to2(imgtest1,img,wk,hk)



let aplied = Variancefilter(Imgtest,Imgtest2,wk,hk);
console.log(aplied);

