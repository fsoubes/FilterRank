// TO DO : find the bug
const js5_slideDownHistogram = function js5_slideDownHistogram(image, radiusKernel, histogramList, rowIndex, result){
    let newHistogramList =[];
    for (let i=0; i<histogramList.length; i++){
	let newKernelHistogram = histogramList[i].slice(0);	    
	newKernelHistogram[image.raster.pixelData[image.width*rowIndex+i]]--;
	newKernelHistogram[image.raster.pixelData[image.width*(rowIndex+radiusKernel*2+1)+i]]++;
	newHistogramList.push(newKernelHistogram);
    }
    js5_computeRowMedian(image, radiusKernel, newHistogramList, result);
    return newHistogramList;
}


// Cette fonction ne fonctionne pas
const js5_computeRightMedian = function js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, columnIndex){
    let halfNbPixelKernel = ((radiusKernel*2+1)*(radiusKernel*2+1)-1)/2;
    for (let i=0; i<256; i++){
	ltmedian = (histogramList[columnIndex][i] != 0 && i < median) ?  ltmedian-histogramList[columnIndex][i] : ltmedian;
	ltmedian = (histogramList[columnIndex+radiusKernel*2+1][i] != 0 && i < median) ? ltmedian+histogramList[columnIndex+radiusKernel*2+1][i] : ltmedian;
    }

    //Test loop
    /*let sumtest = 0;
    for (let i=0; i<256; i++){
	for (let j=0; j<4; j++){
	    sumtest = (histogramList[columnIndex+j][i] < 0) ?  sumtest++ : sumtest;
	}
    }
    console.log(sumtest);*/

    while (ltmedian > halfNbPixelKernel){
	median--;
	let sumMedian = 0;
	for (let j=0; j<radiusKernel*2+1; j++){
	    sumMedian = sumMedian+histogramList[columnIndex+j+1][median];
	}
	ltmedian = ltmedian-sumMedian;
    }
    if (ltmedian <= halfNbPixelKernel){
	let sumMedian = 0;
	for (let j=0; j<radiusKernel*2+1; j++){
	    sumMedian = sumMedian+histogramList[columnIndex+j+1][median];
	}
	while (ltmedian+sumMedian <= halfNbPixelKernel){
	    ltmedian = ltmedian+sumMedian;
	    median++;
	    sumMedian=0;
	    for (let j=0; j<radiusKernel*2+1; j++){
		sumMedian = sumMedian+histogramList[columnIndex+j+1][median];
	    }
	}
    }
    
    
    /*while (ltmedian > halfNbPixelKernel){
	median=median-1;
	let sumMedian = 0;
	for (let i=0; i<radiusKernel*2+1; i++){
	    sumMedian=sumMedian+histogramList[columnIndex+i+1][median];
	}
	///let sumMedian = Array(radiusKernel*2+1).reduce(function(acc, element, index){
	    //return acc+histogramList[columnIndex+index][median];
	    //}, 0);
	ltmedian = ltmedian-sumMedian;
    }
    if (ltmedian <= halfNbPixelKernel){
	let sumMedian = 0;
	for (let i=0; i<radiusKernel*2+1; i++){
	    sumMedian=sumMedian+histogramList[columnIndex+i+1][median];
	}
	//let sumMedian = Array(radiusKernel*2+1).fill(0).map(Number.call, Number).reduce(function(acc, element){
	    //return acc+histogramList[columnIndex+element][median];
	    //}, 0);
	while (ltmedian+sumMedian <= halfNbPixelKernel) {
	    ltmedian = ltmedian+sumMedian;
	    median=median+1;
	}
	//[median,ltmedian] = (ltmedian+sumMedian <= halfNbPixelKernel) ? [median+1, ltmedian+sumMedian] : [median, ltmedian];
    }*/
    return [median, ltmedian];
}

const js5_computeRowMedian = function js5_computeRowMedian(image, radiusKernel, histogramList, result) {
    let kernelHistogram = [];
    let ltmedian = 0;
    
    let sortedKernelPixels = histogramList.filter(function(element, index){ return index<radiusKernel*2+1; })
	.reduce(function(acc, element){
	return acc.concat(element.reduce(function(acc2, element2, index){ return (element2>0) ? acc2.concat(Array(element2).fill(index)) : acc2; }, []));
	}, [])
	.slice()
	.sort((a, b) => a - b);    
    //console.log("SortedKernelPixels :", sortedKernelPixels);
    let median = sortedKernelPixels[(sortedKernelPixels.length-1)/2];
    for (let i=0; i<sortedKernelPixels.length/2+1; i++){
	if (sortedKernelPixels[i] < median){
	    ltmedian++;
	}
    }
    //console.log("Median, LTMedian :", median, ",", ltmedian);   
    result.push(median);
    
    
    for (let i=0; i<image.width-radiusKernel*2-1; i++){
	[median, ltmedian] = js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, i);
	result.push(median);
    }
    return [median, ltmedian];
}

const js5_createHistogram  = function js5_createHistogram(image, radiusKernel, result) {
    let histogramList = [];
    for (let i=0; i<image.width; i++){
	let histogram =  Array(256).fill(0);
	for (let j=0; j<radiusKernel*2+1; j++){
	    histogram[image.raster.pixelData[image.width*j+i]]++;
	}
	histogramList.push(histogram);
    }
    console.log("ListHistogram :", histogramList);
    js5_computeRowMedian(image, radiusKernel, histogramList, result);
    return histogramList;    
}


const js5_medianFilter = function js5_medianFilter(image, radiusKernel) {
    console.log("Pixels :", image.raster.pixelData);
    console.log("Size :", image.width, image.height);
    let result = []
    let histogramList = js5_createHistogram(image, radiusKernel, result);
    for (let i=0; i<image.height-radiusKernel*2-1; i++){
	histogramList = js5_slideDownHistogram(image, radiusKernel, histogramList, i, result);
    }
    console.log(result);
    return result;
}


/*const createImage = (w,h,bg) => Array(w*h).fill(bg);

// importation de l'image
const timesImage = function timesImage(image){
    
}


// creation d'un histogramme de niveau de gris (contenant les valeurs des r premier pixels de la colonne, r etant la hauteur du kernel) pour chaque colonne de l'image
const js5_createHistogram  = function js5_createHistogram(imageArray, imageWidth, imageHeight, radiusKernel, result) {
    let histogramList = [];
    for (let i=0; i<imageWidth; i++){
	let histogram =  Array(256).fill(0);
	for (let j=0; j<radiusKernel*2+1; j++){
	    histogram[imageArray[imageWidth*j+i]]++;
	}
	histogramList.push(histogram);
    }
    console.log(histogramList);
    js5_computeRowMedian(imageArray, imageWidth, imageHeight, radiusKernel, histogramList, result);
    return histogramList;    
}

// on enlève un pixel à chaque histogramme et on ajoute le pixel de la ligne suivante
const js5_slideDownHistogram = function js5_slideDownHistogram(imageArray, imageWidth, imageHeight, radiusKernel, histogramList, rowIndex, result){
    let newHistogramList =[];
    for (let i=0; i<histogramList.length; i++){
	let newKernelHistogram = histogramList[i].slice(0);	    
	newKernelHistogram[imageArray[imageWidth*rowIndex+i]]--;
	newKernelHistogram[imageArray[imageWidth*(rowIndex+radiusKernel*2+1)+i]]++;
	newHistogramList.push(newKernelHistogram);
    }
    js5_computeRowMedian(imageArray, imageWidth, imageHeight, radiusKernel, newHistogramList, result);
    return newHistogramList;
}


// calcul des médiane pour la ligne de l'image à partir des histogramme
const js5_computeRowMedian = function js5_computeRowMedian(imageArray, imageWidth, imageHeight, radiusKernel, histogramList, result) {
    let kernelHistogram = [];
    let ltmedian = 0;
    
    let sortedKernelPixels = histogramList.filter(function(element, index){ return index<radiusKernel*2+1; })
	.reduce(function(acc, element){
	    return acc.concat(element.reduce(function(acc2, element2, index){ return (element2>0) ? acc2.concat(index) : acc2; }, []));
	}, [])
	.slice()
	.sort((a, b) => a - b);    
    console.log(sortedKernelPixels);
    
    let median = sortedKernelPixels[(sortedKernelPixels.length-1)/2];
    for (let i=0; i<sortedKernelPixels.length/2+1; i++){
	if (sortedKernelPixels[i] < median){
	    ltmedian++;
	}
    }
    result.push(median);
    for (let i=0; i<imageWidth-radiusKernel*2-1; i++){
	[median, ltmedian] = js5_computeRightMedian(imageArray, imageWidth, imageHeight, radiusKernel, histogramList, median, ltmedian, i);
	result.push(median);
    }
    return [median, ltmedian];
}

// calcul de médiane pour un pixel situé à droite d'un pixel pour lequel elle a déjà été calculé
const js5_computeRightMedian = function js5_computeRightMedian(imageArray, imageWidth, imageHeight, radiusKernel, histogramList, median, ltmedian, columnIndex){
    let halfNbPixelKernel = ((radiusKernel*2+1)*(radiusKernel*2+1)-1)/2;
    for (let i=0; i<256; i++){
	ltmedian = (histogramList[columnIndex][i] != 0 && i < median) ?  ltmedian-1 : ltmedian;
	ltmedian = (histogramList[columnIndex+radiusKernel*2+1][i] != 0 && i < median) ? ltmedian+1 : ltmedian;
    }
    
    while (ltmedian > halfNbPixelKernel){
	median--;
	let sumMedian = Array(radiusKernel*2+1).reduce(function(acc, element){
	    return acc+histogramList[columnIndex+element][median];
	}, 0);
	ltmedian = ltmedian-sumMedian;
    }
    if (ltmedian <= halfNbPixelKernel){
	let sumMedian = Array(radiusKernel*2+1).fill(0).map(Number.call, Number).reduce(function(acc, element){
	    return acc+histogramList[columnIndex+element][median];
	}, 0);
	[median,ltmedian] = (ltmedian+sumMedian <= halfNbPixelKernel) ? [median+1, ltmedian+sumMedian] : [median, ltmedian];
    }
    return [median, ltmedian];
}



const js5_medianFilter = function js5_medianFilter(imageArray, imageWidth, imageHeight, radiusKernel) {
    let result = []
    let histogramList = js5_createHistogram(imageArray, imageWidth, imageHeight, radiusKernel, result);
    for (let i=0; i<imageHeight-radiusKernel*2-1; i++){
	histogramList = js5_slideDownHistogram(imageArray, imageWidth, imageHeight, radiusKernel, histogramList, i, result);
    }
    console.log(result);
}*/







/*
// main
const imageWidth = 10;
const imageHeight = 10;
const kernelSize = 3;
const radiusKernel = Math.floor(kernelSize/2);
const imageArray = createImage(imageWidth,imageHeight,0);
for (let i=0; i<imageArray.length; i++){
    imageArray[i]=i;
}
//5_expandImage(imageWidth, imageHeight, imageArray, radiusKernel);
console.log(imageArray);
js5_medianFilter(imageArray, imageWidth, imageHeight, radiusKernel);
*/
