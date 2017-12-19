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

	![alg_1](https://github.com/fsoubes/FilterRank/blob/master/images/median_algo3.png)  
#### Fig 1. (a) Moving the histogram down one row by removing a pixel and adding another one. (b) Subtracting one histogram and adding another to move the window to the right.

## Implementation of the min/max filter
## Implementation of the variance filter
Globally the variance function is subdivised in four part, the first part consisting to compute the integral of two images (sum of all the pixels values and the sum of all squared pixels values). Then treating the bundaries issues by adding black pixels at the edges of the image. Thirdly, get the four coordinnates for each pixels in order to return a value through a mathematical formula. Finally, it will compute the variance by substracting the values obtained from the precendent formula for the second image (square) divised by the size of the kernel (h*w) with the square values obtained from the first image divised by the size of the kernel squared.

### pseudo-code for the integral image

The method for variance filtering make use of a faster algorithm to compute the variance of the pixels in a window[^Vio2001][^Sar2015]. From a starting image I, compute an image I' for which the pixel I'(x,y) take as value the sum of all pixels values in the original image between I(0,0) and I(x,y) included [Fig. 2]. Afterwards compute an image I'' for which the pixel I''(x,y) take as value the sum of all squared pixels values in the original image between I(0,0) and I(x,y) included.


Here is an example[Fig. 2] of what the function should do for both input images.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/var_matrix_1.png)  

![](https://github.com/fsoubes/FilterRank/blob/master/images/var_matrix_2.png) 
![](https://github.com/fsoubes/FilterRank/blob/master/images/var_matrix_3.png)  
#### Fig 2. An exemple of a image I and the new computed image I' and I''. 

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
