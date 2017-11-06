/*
	Variance Filter ~ Franck Soubès 
*/

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


let transposition = function (array,w){

	/* 
  	function made by Franck 
    	return an array with rows and columns swapped (1d pixels)
    	arguments (array to transform, width of the image)
 	 */
    
	const newvar =[]; 
	for (let x = 0; x < w; ++x) {
		for (let y = 0; y < w; ++y) {
  		newvar.push(array[x + y * w]);
        	}
	}
  return newvar;
}

/*let padd = function(array, w, h ,k)
{	
	let arr = [];
	for (let x = 0 ; x <w ; x++){
  	for( let y =0 ; y <h ; y++){
    	let ind = x +y*w;
      arr.push[ind];
      }
  }
  return arr;
  
  for (let i = 0 ; i<=k; i++){
		arr.push(0);
    arr.unshift(0); 
  }
  return arr; 
}

let tested = [1,2,3,4,5,6,7,8,9];
console.log(padd(tested,3,3,1));
*/


let SAT = function (array ,w, h){  

	/*  
	function made by Franck Soubès
 	compute the SAT (summed area table) from an array in 1D
  	take 3 arguments (array list, width of they array and 
    	height of this same array)
  	and return the SAT array  
  	*/
  
  let arrayout = [] ; 
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
    return arrayout; 
  }	
  
// have to implement function to padd matrix with 0
  
let transform2 = function (array1d, w){

	/*
  	function made by Franck Soubès
    	return an 2D array from a 1D array
    	argument (array to transform and width of the image/array)   
  	*/
  let array2d = [];
  while(array1d.length) array2d.push(array1d.splice(0,w));
  return array2d ;
}



let Imgfirst = function (array ,w,h,wk,hk){

	/*
  	function made by Franck Soubès
    return an array with computed values I in function of the array in argument
    arguments (array to transform, width of the image, height of the image, 
    width of the kernel and height of the kernel)
  	*/
  
	arrayI =[];
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


let Img6 = Imgfirst(testreal2,w,h,wk,hk); // OK 
let Img5 = Imgfirst(testreal,w,h,wk,hk); // OK
console.log(Img5);
console.log(Img6)



let Variancefilter = function (arrayI, arrayII, w, h,wk,hk) {
	
  /*
    function made by Franck Soubès
    return an array with computed variance for a kernel defined by wk hk
    arguments(array containing values with I' and array containing values with I", width of the image and height of the image)
  */
  
	let filtered=[] ;
	for (let x =0 ; x< w ; x++) {
  	for (let y =0; y< h ; y++) {
    	let ind = (y) +(x*w);
       let compute = (arrayII[ind]/Math.pow(wk,2)) - Math.pow(arrayI[ind]/Math.pow(wk,2),2) ;
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
ImgI = transposition(ImgI,w);
let ImgII = SAT(Img2,w,h);
ImgII = transposition(ImgII,w);
ImgII = transform2(ImgII,w);
ImgI = transform2(ImgI,w);

let testreal2 = transform2(test2,8);
let testreal = transform2(test1,8)

let Img6 = Imgfirst(testreal2,w,h,wk,hk); // OK 
let Img5 = Imgfirst(testreal,w,h,wk,hk); // OK

console.log(Img5);
console.log(Img6)

let applied = Variancefilter(Img5,Img6,w,h,wk,hk);
console.log(applied);


