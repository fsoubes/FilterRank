/*
	Variance Filter
*/


let Img = [5,2,5,2,3,6,3,6,5,2,5,2,3,6,3,6];
const Img2 = Img.map(function(x) {return x * x;}); // using map function to square a list

let SAT = function (array ,w, h){  

	/*
  
	function made by Franck Soubès
  compute the SAT (summed area table) from an array in 1D
  take 3 arguments (array list, width of they array and height of this same array)
  and return the SAT array
  
  */
  let arrayr = [] ; 
	for (let i = 0 ; i < w ; i++){
      let sum = 0 ; // for each new lines sum =0  
  	for (let j = 0 ; j < h ; j++){
    	const ind = (i) +(j*w)        ; // index for 1D 
    	sum = sum + array[ind] ;
      if (i === 0) {
      	array[ind] = sum;
        arrayr.push(array[ind]);
       }
      else{
      	array[ind] = array[ind-1] + sum;
        arrayr.push(array[ind]);
      		}
      } 
    }
    return arrayr; 
  }	
  
function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}  

//console.log(SAT(Img,4,4));
console.log(SAT(Img2,4,4));
console.log(transpose([Img2])); // 1D --> 2D with the right order
Integ = [].concat.apply([], Img2); // 2D --> 1D
console.log(Integ) ;

/*

	for i=0 to w do
   sum←0

   for j=0 to h do
      sum ← sum + in[i, j]

      if i = 0 then
         intImg[i, j] ← sum
      else
         intImg[i, j] ← intImg[i − 1, j] + sum
      end if
   end for 
end for

	http://people.scs.carleton.ca/~roth/iit-publications-iti/docs/gerh-50002.pdf
  
  
  
  
	http://badgerati.com/tutorials/the_integral_image/
	http://apurvsaxena.blogspot.fr/2012/06/code-snippet-summed-area-table.html

*/
/*
let transposition = function (array,w){
	const newvar =[];
	for (let j = 0; j < w; ++j) {
		for (let i = 0; i < w; ++i) {
  		newvar.push(array[j + i * w]);
        }
	}
  return newvar;
}
let test = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let toast = transposition(test,3);
console.log(toast);
*/
