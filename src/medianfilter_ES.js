// on calcule le nombre de pixels égale à la médiane dans le kernel
const computeSumMedian = function computeSumMedian(radiusKernel, histogramList, median, columnIndex){
    return histogramList.filter(function(element, index){ return index > columnIndex && index <= columnIndex+radiusKernel*2+1; })
	.reduce(function(acc, element){	return acc+element[median]; }, 0);
}

// on enlève un pixel à chaque histogramme et on ajoute le pixel de la ligne suivante
const js5_slideDownHistogram = function js5_slideDownHistogram(image, radiusKernel, histogramList, rowIndex, result){
    let newHistogramList = histogramList.reduce(function(acc, element, index){
	let newKernelHistogram = element.slice(0);
	newKernelHistogram[image.raster.pixelData[image.width*rowIndex+index]]--;
	newKernelHistogram[image.raster.pixelData[image.width*(rowIndex+radiusKernel*2+1)+index]]++;
	return acc.concat([newKernelHistogram]);
    }, []);    
    js5_computeRowMedian(image, radiusKernel, newHistogramList, result);
    return newHistogramList;
}

// calcul de médiane pour un pixel situé à droite d'un pixel pour lequel elle a déjà été calculé
const js5_computeRightMedian = function js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, columnIndex){
    let halfNbPixelKernel = ((radiusKernel*2+1)*(radiusKernel*2+1)-1)/2;
    /*for (let i=0; i<256; i++){
	ltmedian = (histogramList[columnIndex][i] != 0 && i < median) ?  ltmedian-histogramList[columnIndex][i] : ltmedian;
	ltmedian = (histogramList[columnIndex+radiusKernel*2+1][i] != 0 && i < median) ? ltmedian+histogramList[columnIndex+radiusKernel*2+1][i] : ltmedian;
    }*/

    // TO DO
    ltmedian = Array(256).fill(0).reduce(function(acc, element, index){
	acc= (histogramList[columnIndex][index] != 0 && index < median) ?  acc-histogramList[columnIndex][index] : acc;
	return (histogramList[columnIndex+radiusKernel*2+1][index] != 0 && index < median) ? acc+histogramList[columnIndex+radiusKernel*2+1][index] : acc;
	
    }, ltmedian);
    //
    
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

    // TO DO
    /*ltmedian = Array(Math.floor(sortedKernelPixels.length/2+1)).fill(0).reduce(function(acc, element, index){
	return (sortedKernelPixels[index] < median) ? acc++ : acc;
    },0);*/
    //
    
    result.push(median);
    
    
    for (let i=0; i<image.width-radiusKernel*2-1; i++){
	[median, ltmedian] = js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, i);
	result.push(median);
    }

    // TO DO
    /*Array(Math.floor(image.width-radiusKernel*2-1)).fill(0).forEach(function(acc, element, index){
	[median, ltmedian] = js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, index);
	result.concat(median);
    });*/
    //
    
    return [median, ltmedian];
}

// creation d'un histogramme de niveau de gris (contenant les valeurs des r premier pixels de la colonne, r etant la hauteur du kernel) pour chaque colonne de l'image
const js5_createHistogram  = function js5_createHistogram(image, radiusKernel, result) {
    let histogramList = Array(image.width).fill(0).reduce(function(acc,element){ return acc.concat([Array(256).fill(0)]); },[]);
    image.raster.pixelData.filter(function(element, index){
	return index < (radiusKernel*2+1)*image.width;
    }).forEach(function(element2, index2){
	histogramList[index2%image.width][element2] = histogramList[index2%image.width][element2]+1;
    });
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


