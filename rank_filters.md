# AUTHORS : Adrien Rohan, Franck Soubès, Guillamaury Debras
version Adrien
# Filters 2D (rank filters)
# 1.Introduction

&nbsp;&nbsp; From a cosmic point of view the earth might not seem of any particular interest. From a terrestrial point of view, the pale blue dot is represented by all kinds of forms, shapes, colors and textures. With the development of devices it became possible to immortalize those traits and store them in multiples databases with the aim of analysing them. However, it's not that simple to obtain perfect images due to the noise or frequency that comes from it. Image noise is random variation of brightness or color information in images. Image processing is a method to perform some operations on an image, in order to extract useful information from it. This field incorporates multitudes of methods described by algorithms helping to reduce noises, remove or amplify frequency components and more. For this project, we will examine three types of 2D rank filters: median, min&max and variance.

&nbsp;&nbsp;  By definition rank filters are non-linear filters using the local gray-level ordering to compute the filtered value[^Soi2002] . The output of the filter is the pixel value selected from a specified position in this ranked list. The ranked list is represented by all the grey values that lie within the window which are sorted, generally from the smallest to the biggest value.
For an identical window the pixel value will differ in function of the filters used (median, min, max and variance). Moreover the size of the window is also influencing the output pixel. 
The median filter is so called because it's an operation which selects the median value.The median filter has been suggested by Tukey[^Tuk1974]. This filter is widely used for reducing certains type of noise and periodic interference patterns in signal and images without severly degrading the signal[^Hua1981].Firstly naive the algorithm was then improved based on the moving histogram technique[^Hua1979].
The filter choosing the maximum or minimum values are designated as the maximum filter or the minimum filter, respectively.In discrete mathematical morphology, the minimum and maximum ranks play a key role since they correspond to the fundamental erosion and dilation operators[^Soi2002][^Wer1985]. The main issues of these filters algorithm are their slowness, to overcome these problems the use of small windows and/or low resolution images is required[^Wei2006]. At last the variance filter is a new approach to edge detection. Edges can be detected using the 1st (Sobel or Cany approaches[^Can1986][^Kit1983]) or 2nd deriviates(Log approach[^Mar1980]) of the grey level intensity. Nevertheless there's other alternatives using synthetic and real images with the variance filter[^Fab2011]. As demonstrated here our three main filters have their own field of expertise. They can be used for removing noise (median filter), detecting edge (variance filter) and mathematical morphology(min/max filters).


&nbsp;&nbsp;  In this report, we shall beging by describing the naive and improved algorithms of our 3 different filters. 
* Median filter
* Min/Max filter
* Variance filter

Next step will be to perform a benchmark on different imageJ plugins, with the objective of comparing their performances such as execution time and the memory load for the Java Virtual Machine (JVM).



# 2.Material & Methods

In this section will be presented the algorithms used for median, min, max and variance filtering in image processing. Images will be considered to be matrix of n X m pixels, each pixel having a value g. All the algorithms will be explained for gray level images, but it is possible to process RGB images by separating the 3 channels and using the algorithms for gray level image on each of the 3 channels and then combine the 3 resulting images. Filtering in image processing is done by replacing the value of each pixel by a value computed from the neighborhood. The neighborhood from a pixel is defined as all the pixels present in a window (or kernel) centered on the original pixel. The window can be of different size and even of different shape. In this section all windows are considered to have a square shape, and have a dimension of w X h pixels, w and h being odd integers, in order to have a single pixel at the center of the window. The handling of the borders of the image will at first be ignored in the following explications of the algorithms and will be adressed further into this rapport.

## Median filter 

https://www.rroij.com/open-access/triple-input-sorter-optimizationalgorithm-of-median-filter-based-onfpga-.php?aid=41377 article à check Adrien

A median filter is a filter that, for each pixel from an input image, will compute the median value of all neighboring pixels and produce an output image where each pixel will take have the median value calculated for the corresponding pixel in the input image.

### Naive algorithm

The naive algorithm for median filtering works as follows. Begin by defining a window of w X h pixels and place that window so that its upper-left corner is on the upper-left corner of the input image. Compute the median value from all the pixels values in the window by ordering them. Slid the window one pixel column to the right and repeat the process until reaching the end of the row, then repeat the process for the following rows until reaching the lower-right corner of the input image. Then create an output image of (n-w+1) X (m-h+1) pixels from all the computed median values, placing the values left to right, up to bottom, beginning with the first computed value to the last.  
To sort all the pixels values in the kernels, different algorithm are possible. One of these is the Quicksort algorithm which chose an arbritrary pivot number from the array (the last one for example), and will create two new arrays, the first one containing all the values lower than the pivot number, and the second one all the values greater than or equal to the pivot number. These operations are repeated on the resulting arrays, until all the resulting arrays can be concatenated in a single sorted array.

### Improved algorithms

Sorting algorithm are costly in time, ans as such it is possible to improve this basic algorithm, which reorder all the pixels values in the window each time it moves, by making use of the fact that only a portion of pixel is removed from the window when it moves to the right, and the same number of pixels is added [^Hua1979][^Hua1981]. The pixel values in the window are stored inside a 256 element array hist[0:255] corresponding to the gray level histogram of the window, so that hist[g]=N mean that N pixel in the current windows take the value g. After computing the median value for the first pixel the regular way and storing it in the varable mdn, store the number of pixels in the window that have a value below the median in a variable ltmdn.  

When sliding the window to the right, to compute the new median,  for each pixel from the leftmost column of the previous window, remove it from the array hist :  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_1.gif)  
and update ltmdn if needed :   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_2.gif) &nbsp;if&nbsp; ![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_3.gif)  
For each pixel from the rightmost column of the new window, add it in the array hist :    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_4.gif)    
and update if needed:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_5.gif) &nbsp;if&nbsp; ![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_3.gif)  
Using the variables ltmdn and mdn, the new median for the current window can be found by doing the following steps.  

If &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_6.gif)  

the current median is lower than mdn, and do :   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_7.gif) &nbsp;&nbsp;and&nbsp;&nbsp; 
![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_8.gif)  
until :  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_9.gif)  


Else if &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_9.gif)  

the current median is greater than or equal to mdn, and test :   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_10.gif)  

If true, do :   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_11.gif) 
&nbsp;&nbsp;and&nbsp;&nbsp; 
![](https://github.com/fsoubes/FilterRank/blob/master/images/Equation/EqMed2_12.gif)  
and re-test. If false mdn is the median of the current window.  

It is possible to further improve this algorithm by changing the way the data are stored, by using more than one gray level histogram to handle the pixels values [^Wei2006].  One gray level histogram of 256 elements is maintained for each column of the image, containing a number h of pixels. By summing w of these histograms, we obtain a kernel of w X h pixels. When sliding the kernel to the right, remove the histogram corresponding to the the leftmost column and add the histogram corresponding to the column right of the previous window. When moving the kernel to the next row, you remove the pixel value from the highest row from each histogram and add the pixels values from the new row included in the kernels as well.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![alg_1](https://github.com/fsoubes/FilterRank/blob/master/images/median_algo3.png)  
(a) Moving the histogtam down one row by removing a pixel and adding another one.  
(b) Subtracting one histogram and adding another to move the window to the right.

## Max/Min filters

### Naive Algorithm

A max and min filter are non-linear digital filtering techniques often used to find respectively the brightest or darkest points in an image.
A max filter operate like a median filter but will search the maximum value among the neighboring pixels instead of computing the median of the neighborhood to create the output image. Likewise, a min filter will search the minimum value of the neighborhood.


The naive algorithm for the max filter is the same as the one from the median filter, but rather than computing the median from the neighboring pixels values, instead compute the maximum value. To improve it, after computing the max value for the first pixel in the row, when moving the window to the right, compute the maximum value from the new pixels (the ones from the rightmost column). If this maximum is greater than the previous one use this new value. Else, check the pixels from the leftmost column of the previous window. If they do not contain the previous maximum value, use this value as the new maximum. Else, compute the maximum value of the new window using the naive algorithm.
### Improved algorithm

A faster algorithm will, instead of computing the output image pixel of (n-p+1) X (m-p+1) pixels directly using a 2-D window, will compute a first output image of (n-p+1) X m pixels using a 1-D window of p pixels on all the rows, then compute the second and final output image of (n-p+1) X (m-p+1) from this first output image using a 1-D window of p pixels on all the columns.

## Variance filter

In image processing, variance filter is often used for highlighting edges in the image by replacing each pixel with the neighbourhood variance. 

![GitHub Logo](https://github.com/fsoubes/FilterRank/blob/master/images/var2.png)
### Equation_1: Variance filter is the square of the standard deviation, where u(x) is image intensity at the location x(x1, x2), σ represent the standard deviation, W is size of a filtering window, u(x-q) is the set of all pixels within the filtering window and q is an element of the set W.
![GitHub Logo2](https://github.com/fsoubes/FilterRank/blob/master/images/var3.png)

### Equation_2&3: Equation used for compute the standard deviation(2) & the mean(3). Where n is the total of pixels within the window (W), and ū is the mean of all the pixels within the window (W).
This filter is implemented in imageJ through the class rankfilters in <img src="https://github.com/imagej/imagej1/blob/ab7633f0f238ba08f65cb1ef5e104dba3d3f68af/ij/plugin/filter/RankFilters.java " alt="java" />. For variance algorithm, according to the input image and the size of the kernel, it will not react in the same way. If the kernel’s radius size is less than 2 (5x5), it will compute the sum over all the pixels, whereas for a kernel’s radius size greater than 2, the sum won’t be calculated. In that case this sum is calculated for the first pixel of every line only. For the following pixels, it’ll add the new values and subtract those that are not in the sum any more. This way, the computational time is then reduced. Once, the kernel reaches the end of the thread, it start over at the next line until the end of the input image. It’s notable that the variance algorithm is closely related to the mean algorithm. 
&nbsp;In application, this algorithm works by using one “window” defined here by a circular kernel, which slides, entry by entry until the end of the signal. It can process through rows or columns.

![alg_1](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_1.png)  
![alg_2](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_2.png)  
![alg_3](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_3.png)  
![alg_4](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_4.png)  
![alg 5](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_5.png)
![alg 6](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_6.png) 

This method is simple, moreover it’s characterised by low computational complexity compared to other methods (Cany, Sobel).
However it’s not devoid of weakness because of its low resistance to noise. Indeed the impulse and Gaussian noise significantly decreases quality of edge detection [^Fab2011]. 


new  

lien : https://computersciencesource.wordpress.com/2010/09/03/computer-vision-the-integral-image/  

![alg_1](https://github.com/fsoubes/FilterRank/blob/master/images/bigexampleimage.png) 
![alg_2](https://github.com/fsoubes/FilterRank/blob/master/images/bigegsat.png)  

Another method for variance filtering make use of a faster algorithm to compute the variance of the pixels in a window[^Sar2015]. For a window B of bounded by the coordinates(x,y,w,h), where x>=w and y>=h, we compute :  

![EqVar2_1](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_1.gif)  
and  

![EqVar2_23](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_2.gif),  
where I'(x,y) is the sum of all pixels values between I(0,0) and I(x,y) inclusive and I''(x,y) is the sum of all squared pixels values between I(0,0) and I(x,y) inclusive. The variance of the pixels value in the window B is :  

![EqVar2_3](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_3.gif)

## Boundary issues

The kernels used in the different filters are partialy out of bound of the image when centered on pixels near the boundary of an image, and in these case there are less pixels available to compute a value from. There are multiple ways to handle these cases. The simplest way is to ignore each case where the kernel is out of bound, resulting in an output image that is cropped compared to the input image. Another method consist to attribute values to out of bound pixels, by giving them the value of the nearest in bound pixels, thus creating enough values to realise the convolution.

<img src="http://www.monsite.com/image.png" alt="Comment mettre un lien menant à une autre page" /> 

## Benchmarking analysis

In order to evaluate

# Results

The results obtained with Rank filters functions were obtained with the same image : Boat 360x288 pixels, for personal concerns we choose to use the 8-bit version of this image.



# Discussion

# Conclusion

## References 

* [^Hua1979] Huang T, Yang G, Tang G. A fast two-dimensional median filtering algorithm. IEEE Transactions on Acoustics, Speech, and Signal Processing. 1979;27(1):13–18.  
* [^Hua1981] Huang TS. Two-dimensional digital signal processing II: transforms and median filters. Springer-Verlag New York, Inc.; 1981.  
* [^Wei2006] Weiss B. Fast median and bilateral filtering. 2006;25(3):519–526.
Acm Transactions on Graphics (TOG).  
* [^Col1999] Coltuc D, Bolon P. Very efficient implementation of max/min filters. In: NSIP; 1999. p. 520–523.  
* [^Gil1993] Gil J, Werman M. Computing 2-D min, median, and max filters. IEEE Transactions on Pattern Analysis and Machine Intelligence. 1993;15(5):504–507.  
* [^Fab2011] Fabijańska A. Variance filter for edge detection and edge-based image segmentation. In: Perspective Technologies and Methods in MEMS Design (MEMSTECH), 2011 Proceedings of VIIth International Conference on. IEEE; 2011. p. 151–154.  
* [^Sar2015] Sarwas G, Skoneczny S. Object localization and detection using variance filter. In: Image Processing & Communications Challenges 6. Springer; 2015. p. 195–202.  
* [^Vio2001] Viola P, Jones M. Rapid object detection using a boosted cascade of simple features. In: Computer Vision and Pattern Recognition, 2001. CVPR 2001. Proceedings of the 2001 IEEE Computer Society Conference on. vol. 1. IEEE; 2001. p. I–I.  
* [^Per2007] Perreault S, Hébert P. Median filtering in constant time. IEEE transactions on image processing. 2007;16(9):2389–2394.
* [^Soi2002] Soille P. On morphological operators based on rank filters. 2002;35(2):527–535. Pattern recognition.  
* [^Tuk1974] Tukey J. Nonlinear (nonsuperposable) methods for smoothing data. Congr Rec 1974 EASCON. 1974;673.  
* [^Wer1985] Werman M, Peleg S. Min-max operators in texture analysis. IEEE transactions on pattern analysis and machine intelligence. 1985;(6):730–733.  
* [^Can1986] Canny J. A computational approach to edge detection. IEEE Transactions on pattern analysis and machine intelligence. 1986;(6):679–698.  
* [^Kit1983] Kittler J. On the accuracy of the Sobel edge detector. 1983;1(1):37–42. Image and Vision Computing.  
* [^Mar1980] Marr D, Hildreth E. Theory of edge detection. Proceedings of the Royal Society of London B: Biological Sciences. 1980;207(1167):187–217.  
