// on calcule le nombre de pixels égale à la médiane dans le kernel
const computeSumMedian = function computeSumMedian(radiusKernel, histogramList, median, columnIndex){
    return histogramList.filter(function(element, index){ return index > columnIndex && index <= columnIndex+radiusKernel*2+1; })
	.reduce(function(acc, element){	return acc+element[median]; }, 0);
}

// on enlève un pixel à chaque histogramme et on ajoute le pixel de la ligne suivante
const js5_slideDownHistogram = function js5_slideDownHistogram(image, radiusKernel, histogramList, rowIndex, result){
    /*let newHistogramList =[];
    for (let i=0; i<histogramList.length; i++){
	let newKernelHistogram = histogramList[i].slice(0);	    
	newKernelHistogram[image.raster.pixelData[image.width*rowIndex+i]]--;
	newKernelHistogram[image.raster.pixelData[image.width*(rowIndex+radiusKernel*2+1)+i]]++;
	newHistogramList.push(newKernelHistogram);
    }*/

    // TO DO
    let newHistogramList = histogramList.reduce(function(acc, element, index){
	let newKernelHistogram = element.slice(0);
	newKernelHistogram[image.raster.pixelData[image.width*rowIndex+index]]--;
	newKernelHistogram[image.raster.pixelData[image.width*(rowIndex+radiusKernel*2+1)+index]]++;
	return acc.concat([newKernelHistogram]);
    }, []);
    //
    
    js5_computeRowMedian(image, radiusKernel, newHistogramList, result);
    return newHistogramList;
}

// calcul de médiane pour un pixel situé à droite d'un pixel pour lequel elle a déjà été calculé
const js5_computeRightMedian = function js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, columnIndex){
    let halfNbPixelKernel = ((radiusKernel*2+1)*(radiusKernel*2+1)-1)/2;
    for (let i=0; i<256; i++){
	ltmedian = (histogramList[columnIndex][i] != 0 && i < median) ?  ltmedian-histogramList[columnIndex][i] : ltmedian;
	ltmedian = (histogramList[columnIndex+radiusKernel*2+1][i] != 0 && i < median) ? ltmedian+histogramList[columnIndex+radiusKernel*2+1][i] : ltmedian;
    }
    
    function computeNewMedianFirstCase(median, ltmedian){
	return (ltmedian <= halfNbPixelKernel) ? [median, ltmedian]
	    :  ( median--, sumMedian = computeSumMedian(radiusKernel, histogramList, median, columnIndex), ltmedian = ltmedian-sumMedian, computeNewMedianFirstCase(median, ltmedian))
    }
    [median, ltmedian] = computeNewMedianFirstCase(median, ltmedian);
    
    function computeNewMedianSecondCase(median, ltmedian){
	sumMedian = computeSumMedian(radiusKernel, histogramList, median, columnIndex);
	return (ltmedian+sumMedian > halfNbPixelKernel) ? [median, ltmedian]
	    : (ltmedian = ltmedian+sumMedian, median++, sumMedian = computeSumMedian(radiusKernel, histogramList, median, columnIndex), computeNewMedianSecondCase(median, ltmedian))
    }
    [median, ltmedian] = (ltmedian <= halfNbPixelKernel) ? (computeNewMedianSecondCase(median, ltmedian)) : [median, ltmedian]; 
    
    return [median, ltmedian];
}

// calcul des médiane pour la ligne de l'image à partir des histogramme
const js5_computeRowMedian = function js5_computeRowMedian(image, radiusKernel, histogramList, result) {
    let kernelHistogram = [];
    let ltmedian = 0;
    
    let sortedKernelPixels = histogramList.filter(function(element, index){ return index<radiusKernel*2+1; })
	.reduce(function(acc, element){
	return acc.concat(element.reduce(function(acc2, element2, index){ return (element2>0) ? acc2.concat(Array(element2).fill(index)) : acc2; }, []));
	}, [])
	.slice()
	.sort((a, b) => a - b);    
    let median = sortedKernelPixels[(sortedKernelPixels.length-1)/2];
    for (let i=0; i<sortedKernelPixels.length/2+1; i++){
	if (sortedKernelPixels[i] < median){
	    ltmedian++;
	}
    }
    result.push(median);
    
    
    for (let i=0; i<image.width-radiusKernel*2-1; i++){
	[median, ltmedian] = js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, i);
	result.push(median);
    }
    return [median, ltmedian];
}

// creation d'un histogramme de niveau de gris (contenant les valeurs des r premier pixels de la colonne, r etant la hauteur du kernel) pour chaque colonne de l'image
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


