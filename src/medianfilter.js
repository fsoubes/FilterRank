const medianFilter = (kernel) => (image,copy=true) => {
    const flatten = (array) => {
	return array.reduce((acc, element) => {
	    return acc.concat(element);
	},[]);
    };
    //// Algorithme utilisé par les images 16bit et float32
    const median1632bit = function median1332bit(){
	let result = Array(image.height).fill(0).reduce((acc4, element4, index4) => {
	    let histogramList = Array(image.width+(radiusKernel)*2).fill(0).reduce((acc,element) => { return acc.concat([Array(radiusKernel*2+1).fill(0)]); },[]);
	    paddedImage.filter((element, index) => {
		return index < (index4+radiusKernel*2+1)*(image.width+(radiusKernel)*2) && index >= index4*(image.width+(radiusKernel)*2);
	    }).forEach((element2, index2) => {
		histogramList[index2%(image.width+(radiusKernel)*2)][Math.floor(index2/(image.width+(radiusKernel)*2))] = element2;
	    });
	    let rowMedian = histogramList.filter((element, index) => { return index <= (image.width+(radiusKernel)*2)-(radiusKernel*2+1); })
		.reduce((acc, element, index) => {
		    let kernelHistogram = histogramList.filter((element2, index2) => {
			return index2 < index+radiusKernel*2+1 && index2 >= index; 
		    }).reduce((acc2, element2) => {
			return acc2.concat(element2);
		    },[]).slice().sort((a, b) => a - b);
		    let median = kernelHistogram[(kernelHistogram.length-1)/2];
		    return acc.concat(median);
		},[]);
	    return acc4.concat(rowMedian);
	},[]);
	return result
    }
    ////    
    //// Algorithme optimisé pour 8 bit
    //// creation d'un histogramme de niveau de gris (contenant les valeurs des r premier pixels de la colonne, r etant la hauteur du kernel) pour chaque colonne de l'image
    const median8bit = function median8bit(){
	let result = [];
	let histSize = 256;
	let histogramList = Array(image.width+(radiusKernel)*2).fill(0).reduce(function(acc,element){ return acc.concat([Array(histSize).fill(0)]); },[]);
	paddedImage.filter(function(element, index){
	    return index < (radiusKernel*2+1)*(image.width+(radiusKernel)*2);
	}).forEach(function(element2, index2){
	    histogramList[index2%(image.width+(radiusKernel)*2)][element2] = histogramList[index2%(image.width+(radiusKernel)*2)][element2]+1;
	});
	js5_computeRowMedian(image, radiusKernel, histogramList, result, histSize);
	//
	
	// TO DO
	Array((image.height+(radiusKernel)*2)-radiusKernel*2-1).fill(0).reduce(function(acc,element,index){
	    //// on enlève un pixel à chaque histogramme et on ajoute le pixel de la ligne suivante
	    let newHistogramList = acc.reduce(function(acc2, element2, index2){
		let newKernelHistogram = element2.slice(0);
		newKernelHistogram[paddedImage[(image.width+(radiusKernel)*2)*index+index2]]--;
		newKernelHistogram[paddedImage[(image.width+(radiusKernel)*2)*(index+radiusKernel*2+1)+index2]]++;
		return acc2.concat([newKernelHistogram]);
	    }, []);    
	    js5_computeRowMedian(image, radiusKernel, newHistogramList, result, histSize);
	    return acc = newHistogramList;
	}, histogramList);
	return result;
    }
    //
    ////
    //// calcul des médiane pour la ligne de l'image à partir des histogramme
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
	Array(Math.floor((image.width+(radiusKernel)*2)-radiusKernel*2-1)).fill(0).forEach(function(element, index){	
	    [median, ltmedian] = js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, index, histSize);
	    result.push(median);
	});
	//    
	return [median, ltmedian];
    }
    //// calcul de médiane pour un pixel situé à droite d'un pixel pour lequel elle a déjà été calculé
    const js5_computeRightMedian = function js5_computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, columnIndex, histSize){
	let halfNbPixelKernel = ((radiusKernel*2+1)*(radiusKernel*2+1)-1)/2;
	// TO DO
	ltmedian = Array(histSize).fill(0).reduce(function(acc, element, index){
	    acc = (histogramList[columnIndex][index] != 0 && index < median) ?  acc-histogramList[columnIndex][index] : acc;
	    return (histogramList[columnIndex+radiusKernel*2+1][index] != 0 && index < median) ? acc+histogramList[columnIndex+radiusKernel*2+1][index] : acc;
	    
	}, ltmedian);
	//
	// KEEP WHILE
	while (ltmedian > halfNbPixelKernel){
	    median--;
	    let sumMedian = 0;
	    /*
	    for (let j=0; j<radiusKernel*2+1; j++){
		sumMedian = sumMedian+histogramList[columnIndex+j+1][median];
		}*/
	    Array(radiusKernel*2+1).fill(0).forEach(function(element, index){
		sumMedian = sumMedian+histogramList[columnIndex+index+1][median];
	    });
	    ltmedian = ltmedian-sumMedian;
	}
	if (ltmedian <= halfNbPixelKernel){
	    let sumMedian = 0;
	    /*
	    for (let j=0; j<radiusKernel*2+1; j++){
		sumMedian = sumMedian+histogramList[columnIndex+j+1][median];
		}*/
	    Array(radiusKernel*2+1).fill(0).forEach(function(element, index){
		sumMedian = sumMedian+histogramList[columnIndex+index+1][median];
	    });
	    while (ltmedian+sumMedian <= halfNbPixelKernel){
		ltmedian = ltmedian+sumMedian;
		median++;
		sumMedian=0;
		/*
		for (let j=0; j<radiusKernel*2+1; j++){
		    sumMedian = sumMedian+histogramList[columnIndex+j+1][median];
		    }*/
		Array(radiusKernel*2+1).fill(0).forEach(function(element, index){
		    sumMedian = sumMedian+histogramList[columnIndex+index+1][median];
		});
	    }
	}
	//
	return [median, ltmedian];
    }


    
    let radiusKernel = Math.floor(kernel.width/2);
    
    //// Padding
    let tmpArray = Array(image.height).fill(0).reduce((acc,element,index) => {
	acc[index] = Array(image.width).fill(0).reduce((acc2, element2, index2) => {
	    return acc2.concat(image.pixelData[index*image.width+index2]);
	},[]);
	return acc;
    },[]).map((element) => {
	return Array(radiusKernel).fill(element[0]).concat(element, Array(radiusKernel).fill(element[image.width-1]));
    });
    let startPaddedImage = Array(radiusKernel).fill(tmpArray[0]);
    let endPaddedImage = Array(radiusKernel).fill(tmpArray[image.height-1]);
    let paddedImage = flatten(startPaddedImage).concat(flatten(tmpArray), flatten(endPaddedImage));
    ////


    // Déteminer le type
    let result2 = (image.type === 'uint8') ? median8bit(): median1632bit();

    
    let resultRaster = T.Raster.from(image);
    resultRaster.pixelData = result2;
    return resultRaster;
}
