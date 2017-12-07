

function remplissage(im,kernel,filtre,type){
    let finalim=[];
    let listedligne0=[];
    let listedim=[];
    let newsize = (kernel-1)*2;
    let kernelmod=kernel-1;
    let ima =  new T.Raster(im.type, im.width, im.height);
    let pixels = im.raster.pixelData;
    let wim = ima.width;
    let h = wim + newsize/2;
    let haut = ima.height;
    let hautc = haut+kernel-1;
    let w = haut + newsize/2;
  
    if ( type == 'lin'){
    
    for (let i=0; i<haut; i++){
        for (let i =0 ; i<h; i++){
        if (filtre == 'max'){
        listedligne0.push(0);
        }
        if (filtre == 'min'){
        listedligne0.push(255);
        }
        }
        
		for (let j=0; j<wim; j++){
	  	let ind = (j)+(i*wim);
 	    // création d'une liste pour la colonne désiré
	    listedim.push(pixels[ind]);
      
		}

    listedligne0.splice(0, wim, ...listedim);
    
     finalim.push(listedligne0);
     
     listedligne0=[];
     listedim=[];
    }
	let oneliste =Two_One(finalim);
   
  
      return oneliste;
    }
    // rajout de valeurs pour avoir une image carre
    
    if ( type =='col'){
	if ( haut <= wim ) {

	    if (filtre=='min'){
		
		for ( let i=0 ; i < wim*(wim-haut+kernelmod); i++){
		    pixels.push(255);
		}

	    }
	    if (filtre =='max'){
		for ( let i=0 ; i < wim*(wim-haut+kernelmod); i++){
		    pixels.push(0);
		}}}

    }

    return pixels;
}



 function Two_One(array){
 var newArr = [];

for(var i = 0; i < array.length; i++)
{
    newArr = newArr.concat(array[i]);
}
 return newArr;
}



function filtreligne(largeur,hauteur,array,kernel,filtr){

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
	  if ( filtr=='max'){
	       maxi = kernelsize(filtr,i,image2,kernel);
      
      output.push(maxi);
      }
      if (filtr=='min'){
            maxi = kernelsize(filtr,i,image2,kernel);
            output.push(maxi);
      
      }
      }
      

      }
      // reinitialisation de la liste dynamique
      image2 = [];      
	}
      // retours de la nouvelle liste avc valeur max pour kernel de taille 3 en 1D
     return output;
}




function filtrecol(largeur,hauteur,array,kernel,filtr){

    //let output=[];
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
 	    // création d'une liste pour la colonne désiré
	    image2.push(array[ind]);
      
		}	      
	    
      
     	for( let p=0; p<image2.length-kernel+1; p++){
      let maxi = 0;
	   
      if (p<image2.length-kernel+1){
	  maxi = kernelsize(filtr,p,image2,kernel);
	  onearray.push(maxi);
      
      
      }
      

	}
	    // reinitialisation de la liste dynamique
	    finalarray.push(onearray);
	    onearray=[];
	    image2 = [];     
	}

    
    let output1 = transpose(finalarray);
    let output2 = Two_One(output1);
    
    
    
    
     return output2;
}

function transpose(array) {
    return array.reduce((prev, next) => next.map((item, i) =>
        (prev[i] || []).concat(next[i])
    ), []);
}




function kernelsize(filtre,i,image2,kernel,copy=true){
    let output = 0 ;
    
    if (filtre=="max"){
	if (kernel ==3 ) {
	   output = Math.max(image2[i],image2[i+1],image2[i+2])
	}
		   
	if (kernel ==5 ) {
	    output = Math.max(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4])
	
	}
	if (kernel ==7 ) {
	    output = Math.max(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6])
	
	}
	if (kernel ==9 ) {
	    output = Math.max(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8])
	
	}
	if (kernel ==11 ) {
	    output = Math.max(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8],image2[i+9],image2[i+10])
	
	}
	if (kernel ==13 ) {
	    output = Math.max(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8],image2[i+9],image2[i+10],image2[i+11],image2[i+12])
	
	}
	
    
    }
    if (filtre=="min"){
	if (kernel ==3 ) {
	   output = Math.min(image2[i],image2[i+1],image2[i+2])
	}
		   
	if (kernel ==5 ) {
	    output = Math.min(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4])
	
	}
	if (kernel ==7 ) {
	    output = Math.min(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6])
	
	}
	if (kernel ==9 ) {
	    output = Math.min(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8])
	
	}
	if (kernel ==11 ) {
	    output = Math.min(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8],image2[i+9],image2[i+10])
	
	}
	if (kernel ==13 ) {
	    output = Math.min(image2[i],image2[i+1],image2[i+2],image2[i+3],image2[i+4],image2[i+5],image2[i+6],image2[i+7],image2[i+8],image2[i+9],image2[i+10],image2[i+11],image2[i+12])
	
	}
    }

	
    
    
    return output;
}
