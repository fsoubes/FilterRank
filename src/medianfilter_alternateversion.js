/*
 *  TIMES: Tiny Image ECMAScript Application
 *  Copyright (C) 2017  Jean-Christophe Taveau.
 *
 *  This file is part of TIMES
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,Image
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with TIMES.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * Authors:
 * Jean-Christophe Taveau
 */


/**
 * @module rankFilters
 */
 
/**
 * Median filter
 *
 * @param {TRaster} kernel - Convolution mask
 * @param {TRaster} img - Input image to process
 * @param {boolean} copy - Copy mode to manage memory usage
 * @return {TRaster} - Filtered Image
 *
 * @author Adrien Rohan
 */
const medianFilter = (kernel) => (image,copy=true) => {
    let outputRaster = T.Raster.from(image);    
    let radiusKernel = Math.floor(kernel.width/2);
    const flatten = (array) => {
	return array.reduce((acc, element) => {
	    return acc.concat(element);
	},[]);
    };
    //// Algorithme utilisé par les images 16bit et float32
    const median1632bit = function median1332bit(){
	outputRaster.pixelData = Array(image.height).fill(0).reduce((acc4, element4, index4) => {
	    let histogramList = Array(image.width+(radiusKernel)*2).fill(0).reduce((acc,element) => { return acc.concat([Array(radiusKernel*2+1).fill(0)]); },[]);
	    paddedImage.slice(index4*(image.width+(radiusKernel)*2),(index4+radiusKernel*2+1)*(image.width+(radiusKernel)*2))
		.forEach((element2, index2) => {
		    histogramList[index2%(image.width+(radiusKernel)*2)][Math.floor(index2/(image.width+(radiusKernel)*2))] = element2;
		});
	    let rowMedian = histogramList.slice(0,image.width)
		.reduce((acc, element, index) => {
		    let kernelHistogram = histogramList.slice(index,index+radiusKernel*2+1)
			.reduce((acc2, element2) => {
			    return acc2.concat(element2);
			},[]).slice().sort((a, b) => a - b);
		    let median = kernelHistogram[(kernelHistogram.length-1)/2];
		    return acc.concat(median);
		},[]);
	    return acc4.concat(rowMedian);
	},[]);
	return outputRaster
    }
    ////    
    //// Algorithme optimisé pour 8 bit
    const median8bit = function median8bit(){
	// creation d'un histogramme de niveau de gris (contenant les valeurs des r premier pixels de la colonne, r etant la hauteur du kernel) pour chaque colonne de l'image
	let histSize = 256;
	let histogramList = Array(image.width+(radiusKernel)*2).fill(0).reduce((acc,element) => { return acc.concat([Array(histSize).fill(0)]); },[]);
	paddedImage.filter((element, index) => {
	    return index < (radiusKernel*2+1)*(image.width+(radiusKernel)*2);
	}).forEach((element2, index2) => {
	    histogramList[index2%(image.width+(radiusKernel)*2)][element2] = histogramList[index2%(image.width+(radiusKernel)*2)][element2]+1;
	});
	computeRowMedian(image, radiusKernel, histogramList, outputRaster, histSize, 0);
	//
	
	Array((image.height+(radiusKernel)*2)-radiusKernel*2-1).fill(0).reduce((acc,element,index) => {
	    //// on enlève un pixel à chaque histogramme et on ajoute le pixel de la ligne suivante
	    let newHistogramList = acc.reduce((acc2, element2, index2) => {
		let newKernelHistogram = element2.slice(0);
		newKernelHistogram[paddedImage[(image.width+(radiusKernel)*2)*index+index2]]--;
		newKernelHistogram[paddedImage[(image.width+(radiusKernel)*2)*(index+radiusKernel*2+1)+index2]]++;
		return acc2.concat([newKernelHistogram]);
	    }, []);
	    //
	    computeRowMedian(image, radiusKernel, newHistogramList, outputRaster, histSize, index+1);
	    return acc = newHistogramList;
	}, histogramList);
	return outputRaster;
    }
    ////
    //// 8bit : calcul des médiane pour la ligne de l'image à partir des histogramme
    const computeRowMedian = (image, radiusKernel, histogramList, outputRaster, histSize, indexRow) =>  {
	let kernelHistogram = [];
	let ltmedian = 0;
	// Calcul de la médiane pour la première position du kernel sur la ligne
	let sortedKernelPixels = histogramList
	    .slice(0,radiusKernel*2+1)
	    .reduce((acc, element) => {
		return acc.concat(element.reduce((acc2, element2, index) => { return (element2>0) ? acc2.concat(Array(element2).fill(index)) : acc2; }, []));
	    }, [])
	    .slice()
	    .sort((a, b) => a - b);    
	let median = sortedKernelPixels[(sortedKernelPixels.length-1)/2];
	ltmedian = Array(Math.floor(sortedKernelPixels.length/2+1)).fill(0).reduce((acc, element, index) => {
	    (sortedKernelPixels[index] < median) ? acc++ : acc;
	    return acc;
	},ltmedian);
	outputRaster.pixelData[indexRow*image.width]=median;
	//
	// Itération sur chaque pixel de la ligne pour calculer la médiane correspondante
	Array(Math.floor((image.width+(radiusKernel)*2)-radiusKernel*2-1)).fill(0).forEach((element, index) => {	
	    [median, ltmedian] = computeRightMedian(image, radiusKernel, histogramList, median, ltmedian, index, histSize);
	    outputRaster.pixelData[indexRow*image.width+index]=median
	});
	//    
	return [median, ltmedian];
    }
    //// 8 bit : calcul de médiane pour un pixel situé à droite d'un pixel pour lequel elle a déjà été calculé
    const computeRightMedian = (image, radiusKernel, histogramList, median, ltmedian, columnIndex, histSize) => {
	let halfNbPixelKernel = ((radiusKernel*2+1)*(radiusKernel*2+1)-1)/2;
	// Algorithme décrit par Huang est appliqué
	ltmedian = Array(histSize).fill(0).reduce((acc, element, index) => {
	    acc = (histogramList[columnIndex][index] != 0 && index < median) ?  acc-histogramList[columnIndex][index] : acc;
	    return (histogramList[columnIndex+radiusKernel*2+1][index] != 0 && index < median) ? acc+histogramList[columnIndex+radiusKernel*2+1][index] : acc;	    
	}, ltmedian);
	while (ltmedian > halfNbPixelKernel){
	    median--;
	    let sumMedian = 0;
	    Array(radiusKernel*2+1).fill(0).forEach((element, index) => { sumMedian = sumMedian+histogramList[columnIndex+index+1][median]; });
	    ltmedian = ltmedian-sumMedian;
	}
	if (ltmedian <= halfNbPixelKernel){
	    let sumMedian = 0;
	    Array(radiusKernel*2+1).fill(0).forEach((element, index) => { sumMedian = sumMedian+histogramList[columnIndex+index+1][median]; });
	    while (ltmedian+sumMedian <= halfNbPixelKernel){
		ltmedian = ltmedian+sumMedian;
		median++;
		sumMedian=0;
		Array(radiusKernel*2+1).fill(0).forEach((element, index) => { sumMedian = sumMedian+histogramList[columnIndex+index+1][median];	});
	    }
	}
	//
	return [median, ltmedian];
    }    
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
    (image.type === 'uint8') ? median8bit(): median1632bit();
    return outputRaster;
}
