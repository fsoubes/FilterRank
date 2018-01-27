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
    let diameterKernelnoCenter = radiusKernel*2;
    const flatten = (array) => {
	return array.reduce((acc, element) => {
	    return acc.concat(element);
	},[]);
    };
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
    //// Traitement de l'image
    outputRaster.pixelData = Array(image.height).fill(0).reduce((acc4, element4, index4) => {
	let histogramList = Array(image.width+diameterKernelnoCenter).fill(0).reduce((acc,element) => { return acc.concat([Array(diameterKernelnoCenter+1).fill(0)]); },[]);
	paddedImage.slice(index4*(image.width+diameterKernelnoCenter),(index4+radiusKernel*2+1)*(image.width+diameterKernelnoCenter))
	    .forEach((element2, index2) => {
		histogramList[index2%(image.width+(radiusKernel)*2)][Math.floor(index2/(image.width+diameterKernelnoCenter))] = element2;
	    });
	let rowMedian = histogramList.slice(0,image.width)
	    .reduce((acc, element, index) => {
		let kernelHistogram = histogramList.slice(index,index+diameterKernelnoCenter+1)
		    .reduce((acc2, element2) => {
			return acc2.concat(element2);
		    },[]).slice().sort((a, b) => a - b);
		let median = kernelHistogram[(kernelHistogram.length-1)/2];
		return acc.concat(median);
	    },[]);
	return acc4.concat(rowMedian);
    },[]);
    return outputRaster;
}
