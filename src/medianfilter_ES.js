// étendre les bordures de l'image
/*const padding = function padding(image){
    image.raster.pixelData.map(function
}*/

// calcul de médiane pour un pixel situé à droite d'un pixel pour lequel elle a déjà été calculé
const js5_computeRightMedian = function js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, columnIndex, histSize){
    let halfNbPixelKernel = ((radiusKernel*2+1)*(radiusKernel*2+1)-1)/2;
    // TO DO
    ltmedian = Array(histSize).fill(0).reduce(function(acc, element, index){
	acc= (histogramList[columnIndex][index] != 0 && index < median) ?  acc-histogramList[columnIndex][index] : acc;
	return (histogramList[columnIndex+radiusKernel*2+1][index] != 0 && index < median) ? acc+histogramList[columnIndex+radiusKernel*2+1][index] : acc;
	
    }, ltmedian);
    //
    // KEEP WHILE
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
    //
    return [median, ltmedian];
}

// calcul des médiane pour la ligne de l'image à partir des histogramme
const js5_computeRowMedian = function js5_computeRowMedian(image, radiusKernel, histogramList, result, histSize) {
    let kernelHistogram = [];
    let ltmedian = 0;    
    let sortedKernelPixels = histogramList.filter(function(element, index){ return index<radiusKernel*2+1; })
	.reduce(function(acc, element){
	return acc.concat(element.reduce(function(acc2, element2, index){ return (element2>0) ? acc2.concat(Array(element2).fill(index)) : acc2; }, []));
	}, [])
	.slice()
	.sort((a, b) => a - b);    
    let median = sortedKernelPixels[(sortedKernelPixels.length-1)/2];
    // TO DO
    ltmedian = Array(Math.floor(sortedKernelPixels.length/2+1)).fill(0).reduce(function(acc, element, index){
	(sortedKernelPixels[index] < median) ? acc++ : acc;
	return acc;
    },ltmedian);
    //    
    result.push(median);
    // TO DO trouver pq concat ne marche pas
    Array(Math.floor(image.width-radiusKernel*2-1)).fill(0).forEach(function(element, index){
	[median, ltmedian] = js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, index, histSize);
	result.push(median);
    });
    //    
    return [median, ltmedian];
}

const js5_medianFilter = function js5_medianFilter(image, radiusKernel) {
    console.log("Pixels :", image.raster.pixelData);
    console.log("Size :", image.width, image.height);
    console.log("Type :", image.type);
    
    let histSize = (image.type === 'uint8') ? 256
	: (image.type === 'uint16') ? 65536 : 256;    
    let result = [];

    //// creation d'un histogramme de niveau de gris (contenant les valeurs des r premier pixels de la colonne, r etant la hauteur du kernel) pour chaque colonne de l'image
    let histogramList = Array(image.width).fill(0).reduce(function(acc,element){ return acc.concat([Array(histSize).fill(0)]); },[]);
    image.raster.pixelData.filter(function(element, index){
	return index < (radiusKernel*2+1)*image.width;
    }).forEach(function(element2, index2){
	histogramList[index2%image.width][element2] = histogramList[index2%image.width][element2]+1;
    });
    js5_computeRowMedian(image, radiusKernel, histogramList, result, histSize);
    //
    
    // TO DO
    Array(image.height-radiusKernel*2-1).fill(0).reduce(function(acc,element,index){
	//// on enlève un pixel à chaque histogramme et on ajoute le pixel de la ligne suivante
	let newHistogramList = acc.reduce(function(acc2, element2, index2){
	    let newKernelHistogram = element2.slice(0);
	    newKernelHistogram[image.raster.pixelData[image.width*index+index2]]--;
	    newKernelHistogram[image.raster.pixelData[image.width*(index+radiusKernel*2+1)+index2]]++;
	    return acc2.concat([newKernelHistogram]);
	}, []);    
	js5_computeRowMedian(image, radiusKernel, newHistogramList, result, histSize);
	return acc = newHistogramList;
    }, histogramList);
    //    
    console.log(result);
    return result;
}


