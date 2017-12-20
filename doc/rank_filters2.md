# AUTHORS : *Adrien Rohan, Franck Soubès, Guillamaury Debras
# Link to <img src="https://github.com/fsoubes/FilterRank " alt="our project GitHub" />
# Filters 2D (rank filters)
# 1.Introduction

&nbsp;&nbsp;Since image have been digitized on a computer's memory, it has been possible to interact in new ways with those images that were otherwise impossible. This is called image proccessing, and it consist of methods used to perform operations on a digital image. Those methods are described with various algorithms that can be used for various purposes in multiple fields. Those applications are used for noise filtering and other image enhancement as well as extracting information from images. In this project, will be examined the algorithms used for three types of 2D rank filters : median, min&max and variance.  

&nbsp;&nbsp;  By definition rank filters are non-linear filters using the local gray-level ordering to compute the filtered value[^Soi2002] . The output of the filter is the pixel value selected from a specified position in this ranked list. The ranked list is represented by all the grey values that lies within the window which are sorted, from the smallest to the highest value.
For an identical window the pixel value will differ in function of the filters used (median, min, max and variance). Moreover the size of the window is also influencing the output pixel. 
The median filter is so called because it's an operation which selects the median value.The median filter has been suggested by Tukey[^Tuk1974]. This filter is widely used for reducing certain type of noise and periodic interference patterns in signal and images without severly degrading the signal[^Hua1981].The naive algorithm was then improved based on the moving histogram technique[^Hua1979].
The filter that chooses the maximum or minimum values is called the maximum filter or the minimum filter. In discrete mathematical morphology, the minimum and maximum ranks play a key role since they correspond to the fundamental erosion and dilation operators[^Soi2002][^Wer1985]. Lastly the variance filter is used to edge detection. Edges can be detected using the 1st (Sobel or Cany approaches[^Can1986][^Kit1983]) or 2nd deriviates(Log approach[^Mar1980]) of the grey level intensity. Nevertheless there's other alternatives using synthetic and real images with the variance filter[^Fab2011]. As demonstrated here our three main filters have their own field of expertise. They can be used for removing noise (median filter), detecting edge (variance filter) and mathematical morphology(min/max filters). The main issues of these filters algorithm are their slowness, to overcome these problems the use of small windows and/or low resolution images is required[^Wei2006].


&nbsp;&nbsp;  In this report, we shall begin by describing the naive and improved algorithms of our 3 different filters. 
* Median filter
* Min/Max filter
* Variance filter

Next step will be to perform a benchmark on different imageJ plugins, with the objective of comparing their performances such as execution time and the memory load for the Java Virtual Machine (JVM). The ImageJ plugins compared are the default ImageJ RankFilters plugin which has implementation for the median, maximum, minimum and variance filters, and the FastFilters plugin, which contains implementation for the median maximum and minimum filters.  




# 2.Material & Methods

## Implementation of the median filter

The basic of a median filter is, for each pixel in an image, to center a WxH kernel on this pixel, and compute the median of the pixels in the kernel range, to create an output image with these computed median values.

The first step of this median filter implementation is to extend the border of the image, so that that there is no undefined value in the kernel range for each pixel position of the original image. The new pixels created are given the value of the nearest pixel of the original image.

The implementation of the median filter used here use 2 different algorithm depending on if the image is in the 8 bit format in the first case or in the 16 bit or float 32 format in the other case. 

If the image is a 16 bit or float 32 image a naive implementation of the median filter is used. For each column in the image, the values of the H (height of the kernel) first pixel of each column are stocked in a corresponding array. Then the first W (width of the kernel) arrays are joined together to get an array containing the values of all the pixels that are inside the kernel when it is placed at the top left of the image. These values are sorted and the median values is taken.
Each time the kernel slid to the right, the values corresponding to the pixels that are not anymore in the kernel are removed from it, while the value of the next column are added, and the new median is computed from these values. This is repeated until the kernel reach the end of the row. Then the process is repeated for the next row, after removing from all the arrays the values that are not anymore in the kernel and adding the new ones, until the lower right corner of the image is reached and the median values for all the pixels of the output image have been computed. 

The algorithm used in the 8 bit image case is based on the algorithm described by [^Hua1979]. This algorithm aim to reduce the number of times a sorting function is called as sorting is time consuming.
For each column of the image a 256 element array is created, with each element equal to 0 at the start, and those arrays are placed into an array Hist. Then for each pixels of coordinate (X,Y) and value G of the first H (height of the kernel) rows of the image, Hist[Y][G] increase by 1.

The median values for the pixels of the first row of the new image can then be computed from that array Hist. First, the median value for the first pixel in the row is computed by retrieving the pixel values that are inside the kernel when it is placed at the start of the row, stocking them in an array and sorting this this array. The median Mdn is then the central element of the sorted array.

To compute the new median value for the pixel to the right, the following algorithm is used, using Mdn, the already computed median, Ltmdn, equal to the number of element in the sorted array that are strictly lower than Mdn, T equal to ((H*W-1)/2) with H and W the height and Width of the kernel, and Hist. Considering Y0 is the column of pixel that is no longer in the kernel, and Yn the new column that is now in the kernel :

	For each 0<=G<256
	if G < Mdn and Hist[Y0][G] > 0
	then do Ltmdn=Ltmdn-Hist[Y0][G].

	Then if G < Mdn and Hist[Yn][G] > 0
	do Ltmdn=Ltmdn+Hist[Yn][G]. 

	If Ltmdn > T
	do Mdn = Mdn-1 and Ltmdn=Ltmdn-(Hist[Y1][Mdn]+...+Hist[Yn][Mdn])
	until Ltmdn <= T.

	Else if Ltmdn <= T
	test Ltmdn+(Hist[Y1][Mdn]+...+Hist[Yn][Mdn]) <= T
	If true do Ltmdn = Ltmdn+(Hist[Y1][Mdn]+...+Hist[Yn][Mdn]) and Mdn=Mdn+1 and re-test
	If false Mdn is the median of the current kernel position.

This process is repeated for each pixels in the row. Then the arrays in Hist are updated for the next row, so that for each pixel of coordinate (X,Y) and of value G that is no more in the kernel Hist[Y][G] decrease by 1, and for each new pixel of coordinate (X,Y) and of value G in the kernel Hist[Y][G]. The the median values for the second row are computed in the same manner as the first, and this is repeated for all the rows of the original image.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![alg_1](https://github.com/fsoubes/FilterRank/blob/master/images/median_algo3.png)  
#### Fig 1. (a) Moving the histogram down one row by removing a pixel and adding another one. (b) Subtracting one histogram and adding another to move the window to the right.

## Implementation of the min/max filter

In the priveous report, we discussed about a min_max filter function whichs operate with consecutiv 1D filters, first in row then in colomns[^Gil1993]. In this report we describe the implementation of such a function.
Our algorithm is based on 2 differents things, first we take care of the edges with the addition of values on the edges depending on the filter(rows or coloms)so the last computation won't crop the image and seconds, the computation itself of the min or max values of the new padded image. Those operation'll be apply twice in a row in order to obtain a fully filtered image.
According to our Teacher Mr.Jean Cristophe Taveau demand, our implementation of the algorithm works on the images types 8-bit, 16-bit and float32. Our algorithm takes care of either min or max filters like the previeous algorithm suggested, and is fully operational on kernel with a size of either 3x3,5x5,7x7,9x9,11x11,13x13.

### Filling edges 
The first part of the algorithm is the _remplissage_ function which allow to obtain a padded image around the edges. This function can work either for the row filter or colomns filter with the paramater _type_. Depending of the type of the images and the filter we want to apply this function'll add extra values on the edges to help compute the min_max values of the image. The associated pseudo code is represented down below :
	
	if type == line
           for each colomn
              for each line+kernelsize/2
	    
	               if filtre = max 
		         	then do liste.push(-1)
			 
		       if filtre = min & type = uint8
				then do  liste.push(255)
			  
		       if filtre = min & type = uint16
		      		then do liste.push(65535)
			  
		        if filtre = min & type = float32
			  	then do liste.push(1)         
	      for each line 
	          do listepixel.push(pixel index)
		  do liste.splice(0,width,...listepixel)
	
        if type =column
	  if height <= width
	     if filter = min
	        while i < width*(width-height+kernelsize-1)
		    if type = uint8
		        do listepixels.push(255)
		    if type = uint16
		        do listepixels.push(65535)
		    if type = float
		        do listepixels.push(1)
		    if filter = max
		       while i < width*(width-height+kernelsize-1)
		       listepixels.push(-1)

### 1D Filters
The second and last part of the algorithm is to compute each row or each columns after the image is padded. Two function have been developped _filtreligne_ and the  _filtrecol_ function respectively for the lines and columns.The functions works as follow, the function takes colmun after column, and for each column it computes either the min or the max values according to the kernel size. The associated pseudo code for the column filter is down below : 

	for each column
	  for each line 
	     do liste.push(index values)
	       for each values in liste-kernelsize+1 
		    do finalimage.push(kernelsizefunction)


The same kind of operation applies for the line filter, the computation of the min or max function is then calculate with the _kernelsize_ function where the pseudo code is down below :
    
    	if filter = max 
		if kernel = 3
	  		do Math.max(image[i],image2[i+1],image[i+2]
		if kernel = 5 
	  		do Math.max(image[i],image[i+1],image[i+2],image[i+3],image[i+4])
		...
		...

	if filter = min 
		if kernel = 3
	  		do Math.min(image[i],image2[i+1],image[i+2]
		if kernel = 5 
	  		do Math.min(image[i],image[i+1],image[i+2],image[i+3],image[i+4])
		...
		...
For the line filter we do not need to apply any other transformations in our image but for the column filter we need to transpose the final filtered image because by pushing our values we rotated the values in the array, finally we apply a function on this array that will makes the two Dimensional array into one. 
The _min_max function is the main function where the whole process is applied(rows padding into line filtering into columns padding with finally column filtering).

## Implementation of the variance filter
Globally the variance function is subdivised in four part, the first part consisting to compute the integral of two images (sum of all the pixels values and the sum of all squared pixels values). Then treating the bundaries issues by adding black pixels at the edges of the image. Thirdly, get the four coordinates for each pixels in order to compute the sum of value of pixels in the rectangular region. Finally, compute the variance by substracting the values obtained through the precendent formula for the second image (squared) divised by the size of the kernel (h*w) with the square values obtained from the first image divised by the size of the kernel squared.

### implementation and pseudo-code for the integral image

The Integral Image is used as a quick and effective way of calculating the sum of values (pixel values) in a given image – or a rectangular subset of a grid[^SHI2017].
The method for variance filtering make use of a faster algorithm to compute the variance of the pixels in a window[^Vio2001][^Sar2015]. From a starting image I, compute an image I' for which the pixel I'(x,y) take as value the sum of all pixels values in the original image between I(0,0) and I(x,y) included [Fig. 2].


![](https://github.com/fsoubes/FilterRank/blob/master/images/var_integ1.png)
#### Fig 2. An example of the area pixels between I(0,0) and I(x,y) included. 

Afterwards compute an image I'' for which the pixel I''(x,y) take as value the sum of all squared pixels values in the original image between I(0,0) and I(x,y) included. Here is an example[Fig. 3] of what the function should do for both input images.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![](https://github.com/fsoubes/FilterRank/blob/master/images/var_matrix_1.png)  

&nbsp;&nbsp;&nbsp;&nbsp;
![](https://github.com/fsoubes/FilterRank/blob/master/images/var_matrix_2.png) 
![](https://github.com/fsoubes/FilterRank/blob/master/images/var_matrix_3.png)  
#### Fig 3. An exemple of a image I and the new computed image I' and I''. 

The implementation of this algorithm was first describe by [^BRA2007] with the following pseudo code.

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
	    
Integral image was first implemented by using nested for loops, it was then transformed in functionnal programming by following the ECMAScript6 syntax with first the uses of two forEach after having transform the width and the height in index with the use of map.
Afterwards a better functionnal method was proposed by J.C Taveau using a reduce with the use of an accumulator in order to compute the summed-area table, this method is used in the implementation of the variance filter. The main advantages of this method is that it is 100% functionnal whereas the previous method even if faster was not totally functionnal because of the two forEach moreover it uses less characters than the other method (207 characters against 336 characters). However this method has also some disadvantages caused by the accumulator that cost as an extra row and forEach is way more faster than reduce. All of these methods are still provided in the variance filter script.

### Implementation of the padding and currying computational.

The image is firstly transformed from a 1d array to a 2d array. In the aim of treating the borders, we defined a constant ker obtained by the following formula:

	With k = kernel
	ker = ((k-1)/2) *2

The resulting number will give to the _padding_ function the number of rows and columns that has to be added. For a kernel ("Window") of diameter 2 and 3 it will respectively padd the image of 1 black pixel (0) or 2 black pixels. This constant is specified to our main algorithm when convolving. Indeed the first computed pixel is not the central pixel here but the first pixel in the kernel. The _padding_ function is mainly using function concat with one map to realize the padding. This method act as a curried function because it's not returning the padding with a matrix pixels of different size compare to the original input. It takes a function _padding_ whose return value is another function _getCoord_. The final result is automatically transform in 1D without the uses of any particular method. 

This method act as following:

	img_returned = liste	
	for x= k-1 to h+(k-2) do
	  for y= k-1 to w+(k-2) do     		  
	    if img[x-1][y-1] = 0 and img[x+k-1][y-1] = 0 or
	    img[x+k-1][y+k-1] = 0 and img[x+k-1][y-1] = 0 and img[x+k-1][y+k-1] = 0 or
	    img[x-1][y-1] = 0 and img[x-1][y+k-1] = 0 or
	    img[x+k-1][y+k-1] = 0 && img[x-1][y+k-1] = 0 then 
	      img_returned = 0	   
	    else	
	      A = img[x-1][y-1]
	      B = img[x+k-1][y-1]
	      C = img[x-1][y+k-1]
	      D = img[x+k-1][y+k-1]
	      I = A-B-C+D
	      img_returned = I
	    end if
	  end for 
	end for

In this method the borders are treated with 4 ternary condition. The first if condition treat all the left values, while the second,third and last condition are treating respetively down, up and right borders. In order to avoid black pixel in the output we're using the available Crop method in the times API.

For a better understanding of this pseudo code here an example of how it is working[Fig. 4.]

![](https://github.com/fsoubes/FilterRank/blob/master/images/var_coord1.png)  
#### Fig 4. The four shaded coordinates are used in order to compute the sum of the delineated rectangular (kernel) region whith A,B,C and D respectively represented by the top left, down left, top right and down right shaded locations, M represented by the diameter of the kernel, W and H by the width and the height of the array and finally yc and xc is the treated pixel by A,B,C and D. 

### Implementation of the Variancefilter() function.

The last function _getvar_ takes the return of the previous function and compute the formula[Fig. 5] and repeat it for each window. _getvar_ method requires two images as parameter in order to compute this equation with the square kernel. Moreover our function considers each type of image (8bit, 16bit and float32) and convert the aberant values to the adaptated type.

![EqVar2_3](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_3.gif)
#### Fig 5. Where n is the kernel diameter, I" corresponds to the sum of value of pixels in the rectangular region for the squared image and I' sum of value of pixels in the rectangular region.

This formula allows us to compute  the variance of rectangular patch of image. The associated pseudo code is represented down below :

	for x=0 to w do
	  for y=0 to h do 
	    result = (I"[x +y*w]/(kernel*kernel)) - (I'[x+y*w]/(kernel)* I'[x+y*w]/(kernel))
	    if result > 255 and type = 8bit then
	      var = 255	   
	    else if result > 65535 and type = 16bit then
	      var = 65535
	    else if result > 1 and type = float32 then
	      var = 1
	    else
	      var = result
	    end if
	  end for 
	end for

Finally _getvar_ function is called in the main function _variance_ with one _padding_ taking as first argument the sum of all pixels values in the original image and a second argument _padding_ taking as first argument the sum of all squared pixels values in the original image 


## Benchmarking analysis
Benchmarking analysis is a method widely used to assess the relative performance of an object[^Fle1896]. That way, it's possible to compare the performance of various algorithms. Only execution time and memory load will be analysed here. In order to perform this benchmark, two scripts were implemented. The first script, named *benchmark2* whose aim is to compute the time speed between the start and the end of an input image coming from ImageJ during the filtering process. This script was implemented using the ImageJ macro language. The second script *memoryall.js* was implemented in javascript, to measure the memory used by the JVM while running the filter in ImageJ until the end of the process. 
The operation process is ran 1100 times for both measurements to provide robust data. In order to not recording false values we're not considering the first 100 values. Indeed during the execution, we must take into account the internal allocations of the loading images which may introduce error in our measurement.

For this project the benchmark was performed with the operating system Linux (4.9.0-3-amd64)  using the 1.8.0_144 version of Java and running with the 1.51q version of ImageJ. The model image of this benchmark is Lena for various pixels size.
# 3.Results
## Benchmark comparison between ImageJ and our implementation
## Image results
### Median filter
### Min/Max filter
### Variance filter


To compute the variance for a window B on the original image bounded by the coordinates(x,y,w,h), where x<=w and y<=h, compute :  

![EqVar2_1](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_1.gif)  
and  

![EqVar2_23](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_2.gif),  
where I'(x,y) is the sum of all pixels values between I(0,0) and I(x,y) inclusive and I''(x,y) is the sum of all squared pixels values between I(0,0) and I(x,y) inclusive. The variance of the pixels value in the window B is :  

![EqVar2_3](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_3.gif)  
Repeat for each window. The default variance filter in ImageJ is based on this algorithm. 


# 4.Discussion
# 5.Conclusion

## References

[^Hua1979] Huang T, Yang G, Tang G. A fast two-dimensional median filtering algorithm. IEEE Transactions on Acoustics, Speech, and Signal Processing. 1979;27(1):13–18.  

[^Hua1981] Huang TS. Two-dimensional digital signal processing II: transforms and median filters. Springer-Verlag New York, Inc.; 1981.

[^Wei2006] Weiss B. Fast median and bilateral filtering. 2006;25(3):519–526.
Acm Transactions on Graphics (TOG).  

[^Col1999] Coltuc D, Bolon P. Very efficient implementation of max/min filters. In: NSIP; 1999. p. 520–523.  

[^Gil1993] Gil J, Werman M. Computing 2-D min, median, and max filters. IEEE Transactions on Pattern Analysis and Machine Intelligence. 1993;15(5):504–507.  

[^Fab2011] Fabijańska A. Variance filter for edge detection and edge-based image segmentation. In: Perspective Technologies and Methods in MEMS Design (MEMSTECH), 2011 Proceedings of VIIth International Conference on. IEEE; 2011. p. 151–154.  

[^Sar2015] Sarwas G, Skoneczny S. Object localization and detection using variance filter. In: Image Processing & Communications Challenges 6. Springer; 2015. p. 195–202.  

[^Vio2001] Viola P, Jones M. Rapid object detection using a boosted cascade of simple features. In: Computer Vision and Pattern Recognition, 2001. CVPR 2001. Proceedings of the 2001 IEEE Computer Society Conference on. vol. 1. IEEE; 2001. p. I–I.  

[^Per2007] Perreault S, Hébert P. Median filtering in constant time. IEEE transactions on image processing. 2007;16(9):2389–2394.

[^Soi2002] Soille P. On morphological operators based on rank filters. 2002;35(2):527–535. Pattern recognition.  

[^Tuk1974] Tukey J. Nonlinear (nonsuperposable) methods for smoothing data. Congr Rec 1974 EASCON. 1974;673.  

[^Wer1985] Werman M, Peleg S. Min-max operators in texture analysis. IEEE transactions on pattern analysis and machine intelligence. 1985;(6):730–733.  

[^Can1986] Canny J. A computational approach to edge detection. IEEE Transactions on pattern analysis and machine intelligence. 1986;(6):679–698.  

[^Kit1983] Kittler J. On the accuracy of the Sobel edge detector. 1983;1(1):37–42. Image and Vision Computing. 

[^Mar1980] Marr D, Hildreth E. Theory of edge detection. Proceedings of the Royal Society of London B: Biological Sciences 1980;207(1167):187–217.

[^Fle1896] Philip J. Fleming and John J. Wallace. 1986. How not to lie with statistics: the correct way to summarize benchmark results. Commun. ACM 29, 3 (March 1986), 218-221.

[^BRA2007] Bradley D, Roth G. Adaptive thresholding using integral image. Journal of Graphics Tools. Volume 12, Issue 2. pp. 13-21. 2007. NRC 48816.

[^SHI2017] Shivani Km, A Fast Integral Image Computing Methods: A Review Design Engineer, Associated Electronics Research
Foundation, C-53, Phase-II, Noida (India)
