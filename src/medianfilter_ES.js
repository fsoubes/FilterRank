// étendre les bordures de l'image
const paddingMedian = function paddingMedian(image, radiusKernel){
    let tmpArray = Array(image.height).fill(0).reduce(function(acc,element,index){
	acc[index] = Array(image.width).fill(0).reduce(function(acc2, element2, index2){
	    return acc2.concat(image.raster.pixelData[index*image.width+index2]);
	},[]);
	return acc;
    },[]).map(function(element){
	return Array(radiusKernel).fill(element[0]).concat(element, Array(radiusKernel).fill(element[image.width-1]));
    });
    let startPaddedImage = Array(radiusKernel).fill(tmpArray[0]);
    let endPaddedImage = Array(radiusKernel).fill(tmpArray[image.height-1]);
    const flatten = function flatten(array){
	return array.reduce(function(acc, element){
	    return acc.concat(element);
	},[]);
    };
    let paddedImage = flatten(startPaddedImage).concat(flatten(tmpArray), flatten(endPaddedImage));
    return paddedImage;
}

// Algorithme naif pour float32
const computeFloat32Median = function computeFloat32Median(image, radiusKernel, paddedImage){
    console.log("Test");
    //let result = Array(image.height-(radiusKernel*2+1)+1).fill(0).reduce(function(acc4, element4, index4){
    let result = Array(image.height).fill(0).reduce(function(acc4, element4, index4){
	let histogramList = Array(image.width+(radiusKernel)*2).fill(0).reduce(function(acc,element){ return acc.concat([Array(radiusKernel*2+1).fill(0)]); },[]);
	paddedImage.filter(function(element, index){
	    return index < (index4+radiusKernel*2+1)*(image.width+(radiusKernel)*2) && index >= index4*(image.width+(radiusKernel)*2);
	}).forEach(function(element2, index2){
	    histogramList[index2%(image.width+(radiusKernel)*2)][Math.floor(index2/(image.width+(radiusKernel)*2))] = element2;
	});
	let rowMedian = histogramList.filter(function(element, index){ return index <= (image.width+(radiusKernel)*2)-(radiusKernel*2+1); })
	    .reduce(function(acc, element, index){
		let kernelHistogram = histogramList.filter(function(element2, index2){
		    return index2 < index+radiusKernel*2+1 && index2 >= index; 
		}).reduce(function(acc2, element2){
		    return acc2.concat(element2);
		},[]).slice()
		    .sort((a, b) => a - b);
		let median = kernelHistogram[(kernelHistogram.length-1)/2];
		return acc.concat(median);
	    },[]);
	return acc4.concat(rowMedian);
    },[]);
    console.log("ResultFloat32 :", result);
    return  result;
}


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
    console.log("Length :", image.raster.pixelData.length);

    //// Padding
    let paddedImage = paddingMedian(image, radiusKernel);
    console.log("Paddedlength :", paddedImage.length);
    ////

    //// Gestion d'une image float32
    //let result = (image.type === 'float32') ? computeFloat32Median(image, radiusKernel, paddedImage) : null;
    let result = computeFloat32Median(image, radiusKernel, paddedImage);
    ////

    /*
    let result = []; 
    let histSize = (image.type === 'uint8') ? 256
	: (image.type === 'uint16') ? 65536 : 256;       
    
    ////// uint8 et uint16
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
    //////
    */
    console.log("Finallength :", result.length);
    return result;
}


