# 1.Introduction

# 2.Material & Methods

In this section will be presented the algorithms used for median, min, max et variance filtering in image processing. Images will be considered to be matrix of n X m pixels of value g.

A median filter is a filter that, for each pixels from an input image, will compute the median value of all the neighboring pixels and produce an output image where each pixel will take have the median value calculated for the corresponding pixel in the input image.

The naive algorithm for median filtering works as follows. Begin by defining a window of p X p pixels, p being an odd integer, so that a single pixel form the center of the window. Place that window so that its upper-left corner is on the upper-left corner of the input image. Compute the median value from all the pixels values in the window by ordering them. Slid thew window one pixel column to the right and repeat the process until reaching the end of the row, then repeat the process for the following rows until reaching the lower-right corner of the input image. Then create an output image of (n-p+1) X (m-p+1) pixels from all the computed median values, placing the values left to right, up to bottom, beginning with the first computed value to the last.

It is possible to improve this basic algorithm, which reorder all the pixels values in the window each time it move, by making use of the fact that only a portion of pixel is removed from the window when it move to the right, and the same number of pixels is added. Compute the median value of the first pixel the normal way and put it in the variable mdn, create an 256 element array hist[0:255] corresponding to the gray level histogram of the window, and track the number of pixel below the median in variable ltmdn.

To compute the new median when moving the window to the right, remove each pixels of the leftmost column of the previous window 1. from the array:   
2.	hist[g] = hist[g]-1,  
3. and update :   
	ltmdn = ltmdn-1 if g<mdn.  
 Add in the array the pixels values of the rightmost column of the current window :   
	hist[g] = hist[g]+1,  
 and update   
	ltmdn = ltmdn+1 if g<mdn.  
If  
	ltmdn > (p²-1)/2,  
the current median is lower than mdn, and do :   
	mdn = mdn-1   
and   
	ltmdn = ltmdn-hist[mdn]  
until :  
	ltmdn <= (p²-1)/2.   
If   
	ltmdn <= (p²-1)/2,  
 the current median is greater than or equal to mdn, and test :   
	ltmdn + hist[mdn] <= (p²-1)/2.   
If true, do :   
	ltmdn = ltmdn + hist[mdn]   
and   
	mdn = mdn+1   
and re-test. If false mdn is the median of the current window.

A max filter operate like a median filter but will search the maximum value among the neighboring pixels instead of computing the median of the neighborhood to create the output image. Likewise, a min filter will search the minimum value of the neighborhood.
The naive algorithm for the max filter is the same as the one from the median filter, but rather than computing the median from the neighboring pixels values, instead compute the maximum value. To improve it, after computing the max value for the first pixel in the row, when moving the window to the right, compute the maximum value from the new pixels (the ones from the rightmost column). If this maximum is greater than the previous one use this new value. Else, check the pixels from the leftmost column of the previous window. If they do not contain the previous maximum value, use this value as the new maximum. Else, compute the maximum value of the new window using the naive algorithm.
A faster algorithm will, instead of computing the output image pixel of (n-p+1) X (m-p+1) pixels directly using a 2-D window, will compute a first output image of (n-p+1) X m pixels using a 1-D window of p pixels on all the rows, then compute the second and final output image of (n-p+1) X (m-p+1) from this first output image using a 1-D window of p pixels on all the columns.

A variance filter will compute the variance between the pixels of the neighborhood to create the output image.

# 3.Results

# 4.Discussion

# 5.Conclusion
