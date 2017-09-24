# 1.Introduction

From a cosmic point of view the earth might not seem of any particular interest. However from a terrestrial point of view, the pale blue dot is represented by all kinds of forms, shapes, colors and textures. With the development of devices it became possible to immortalize those traits and store them in multiples databases with the aim of treating them. Furthermore, it's not that simple to obtain perfect images due to the noise or frequency that comes from it. Image noise is random variation of brightness or color information in images. Image processing is a method to perform some operations on an image, in order to extract useful information from it. This field incorporates multitudes of methods described by algorithms helping to reduce noises, remove or amplify frequency components. For this project, we will examine four types of 2D rank filters: median, min, max and variance.

By definition Rank filters are non-linear filters using the local gray-level ordering to compute the filtered value[1] . The output of the filter is the pixel value selected from a specified position in this ranked list. The ranked list is represented by all the grey values that lie within the kernel (window) which are sorted, generally from the smallest to the biggest value.
For an identical window the pixel value will differ in function of the filters used (median, min, max and variance). Moreover the size of the kernel is also influencing the output pixel. 
The filter choosing the maximum or minimum values are designated as the maximum filter or the minimum filter, respectively. The median filter is so called because it's an operation which selects the median value. This filter is the most commonly model cited and used in scientific reports.At last the variance filter ...
The median filter has been suggested by Tukey[2]. Firstly naiv the algorithm was then improved based on the moving histogram technique[3].













# 2.Material & Methods

In this section will be presented the algorithms used for median, min, max and variance filtering in image processing. Images will be considered to be matrix of n X m pixels of value g.

## Median filter

A median filter is a filter that, for each pixel from an input image, will compute the median value of all  neighboring pixels and produce an output image where each pixel will take have the median value calculated for the corresponding pixel in the input image.

The naive algorithm for median filtering works as follows. Begin by defining a window of p X p pixels, p being an odd integer, in order to have a single pixel at the center of the window. Place that window so that its upper-left corner is on the upper-left corner of the input image. Compute the median value from all the pixels values in the window by ordering them. Slid thew window one pixel column to the right and repeat the process until reaching the end of the row, then repeat the process for the following rows until reaching the lower-right corner of the input image. Then create an output image of (n-p+1) X (m-p+1) pixels from all the computed median values, placing the values left to right, up to bottom, beginning with the first computed value to the last.

It is possible to improve this basic algorithm, which reorder all the pixels values in the window each time it moves, by making use of the fact that only a portion of pixel is removed from the window when it moves to the right, and the same number of pixels is added. Compute the median value of the first pixel the normal way and put it in the variable mdn, create an 256 element array hist[0:255] corresponding to the gray level histogram of the window, and track the number of pixel below the median in variable ltmdn.

To compute the new median when moving the window to the right, remove each pixels from the leftmost column of the previous window from the array:   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hist[g] = hist[g]-1,  
and update :   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ltmdn = ltmdn-1 if g<mdn.  
Add in the array the pixels values of the rightmost column of the current window :    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hist[g] = hist[g]+1,  
and update   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ltmdn = ltmdn+1 if g<mdn.  
If  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ltmdn > (p²-1)/2,  
the current median is lower than mdn, and do :   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mdn = mdn-1   
and   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ltmdn = ltmdn-hist[mdn]  
until :  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ltmdn <= (p²-1)/2.   
If   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ltmdn <= (p²-1)/2,  
the current median is greater than or equal to mdn, and test :   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ltmdn + hist[mdn] <= (p²-1)/2.   
If true, do :   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ltmdn = ltmdn + hist[mdn]   
and   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mdn = mdn+1   
and re-test. If false mdn is the median of the current window.

## Max/Min filters

A max filter operate like a median filter but will search the maximum value among the neighboring pixels instead of computing the median of the neighborhood to create the output image. Likewise, a min filter will search the minimum value of the neighborhood.
The naive algorithm for the max filter is the same as the one from the median filter, but rather than computing the median from the neighboring pixels values, instead compute the maximum value. To improve it, after computing the max value for the first pixel in the row, when moving the window to the right, compute the maximum value from the new pixels (the ones from the rightmost column). If this maximum is greater than the previous one use this new value. Else, check the pixels from the leftmost column of the previous window. If they do not contain the previous maximum value, use this value as the new maximum. Else, compute the maximum value of the new window using the naive algorithm.
A faster algorithm will, instead of computing the output image pixel of (n-p+1) X (m-p+1) pixels directly using a 2-D window, will compute a first output image of (n-p+1) X m pixels using a 1-D window of p pixels on all the rows, then compute the second and final output image of (n-p+1) X (m-p+1) from this first output image using a 1-D window of p pixels on all the columns.

## Variance filter

A variance filter will compute the variance between the pixels of the neighborhood to create the output image.

# 3.Results

# 4.Discussion

# 5.Conclusion

## References

[1]	(1, 2) Pierre Soille, On morphological operators based on rank filters, Pattern Recognition 35 (2002) 527-535, DOI:10.1016/S0031-3203(01)00047-4
[2] J. Tukey,Nonlinear (nonsuperposable) methods for smoothing data,In Cong. Rec., EASCON, 1974,p. 673.
[3] T. Huang,G. Yang, G. Tang,A fast two-dimensionalmedian "ltering algorithm,IEEE Trans. Acoust. Speech Signal Process. 27 (1) (1979) 13}18.
