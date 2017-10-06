# AUTHORS : Adrien Rohan, Franck Soubès, Guillamaury Debras
# Filters 2D (rank filters)
# 1.Introduction

&nbsp;&nbsp;Since image have been digitized on a computer's memory, it has been possible to interact in new ways with those images that were otherwise impossible. This is called image proccessing, and it consist into methods used to perform operations on a digital image. Those methods are described with various algorithms that can be used for various purposes in multiple fields. Those applications are used for noise filtering and other image enhancement as well as extracting information from images. In this project, will be examined the algorithms used for three types of 2D rank filters : median, min&max and variance.  

&nbsp;&nbsp;  By definition rank filters are non-linear filters using the local gray-level ordering to compute the filtered value[^Soi2002] . The output of the filter is the pixel value selected from a specified position in this ranked list. The ranked list is represented by all the grey values that lies within the window which are sorted, from the smallest to the highest value.
For an identical window the pixel value will differ in function of the filters used (median, min, max and variance). Moreover the size of the window is also influencing the output pixel. 
The median filter is so called because it's an operation which selects the median value.The median filter has been suggested by Tukey[^Tuk1974]. This filter is widely used for reducing certain type of noise and periodic interference patterns in signal and images without severly degrading the signal[^Hua1981].Firstly naive the algorithm was then improved based on the moving histogram technique[^Hua1979].
The filter that chooses the maximum or minimum values are designated as the maximum filter or the minimum filter. In discrete mathematical morphology, the minimum and maximum ranks play a key role since they correspond to the fundamental erosion and dilation operators[^Soi2002][^Wer1985]. The main issues of these filters algorithm are their slowness, to overcome these problems the use of small windows and/or low resolution images is required[^Wei2006]. At last the variance filter is a new approach to edge detection. Edges can be detected using the 1st (Sobel or Cany approaches[^Can1986][^Kit1983]) or 2nd deriviates(Log approach[^Mar1980]) of the grey level intensity. Nevertheless there's other alternatives using synthetic and real images with the variance filter[^Fab2011]. As demonstrated here our three main filters have their own field of expertise. They can be used for removing noise (median filter), detecting edge (variance filter) and mathematical morphology(min/max filters).


&nbsp;&nbsp;  In this report, we shall begin by describing the naive and improved algorithms of our 3 different filters. 
* Median filter
* Min/Max filter
* Variance filter

Next step will be to perform a benchmark on different imageJ plugins, with the objective of comparing their performances such as execution time and the memory load for the Java Virtual Machine (JVM). The ImageJ plugins compared are the default ImageJ RankFilters plugin which has implementation for the median, maximum, minimum and variance filters, and the FastFilters plugin, which contains implementation for the median maximum and minimum filters.  


# 2.Material & Methods

In this section will be presented the algorithms used for median, min, max and variance filtering in image processing. Images will be considered to be matrix of n X m pixels, each pixel having a value g. All the algorithms will be explained for gray level images, but it is possible to process RGB images by separating the 3 channels and using the algorithms for gray level image on each of the 3 channels and then combine the 3 resulting images. Filtering in image processing is done by replacing the value of each pixel by a value computed from the neighborhood. The neighborhood from a pixel is defined as all the pixels present in a window (or kernel) centered on the original pixel. The window can be of different size and even of different shape. In this section all windows are considered to have a square shape, and have a dimension of w X h pixels, w and h being odd integers, in order to have a single pixel at the center of the window. The handling of the borders of the image will at first be ignored in the following explications of the algorithms and will be adressed further into this rapport.

## Median filter 

A median filter is a filter that, for each pixel from an input image, will compute the median value of all neighboring pixels and produce an output image where each pixel will take have the median value calculated for the corresponding pixel in the input image.

### Naive algorithm

The naive algorithm for median filtering works as follows. Begin by defining a window of w X h pixels and place that window so that its upper-left corner is on the upper-left corner of the input image. Compute the median value from all the pixels values in the window by ordering them. Slide the window one pixel column to the right and repeat the process until reaching the end of the row, then repeat the process for the following rows until reaching the lower-right corner of the input image. Then create an output image of (n-w+1) X (m-h+1) pixels from all the computed median values, placing the values left to right, up to bottom, beginning with the first computed value to the last.  

![alg_1](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_1.png)  
![alg_2](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_2.png) 
![alg_3](https://github.com/fsoubes/FilterRank/blob/master/images/alg_med_1.png)  
![alg_4](https://github.com/fsoubes/FilterRank/blob/master/images/alg_med_2.png)  
![alg_5](https://github.com/fsoubes/FilterRank/blob/master/images/alg_med_3.png)  


To sort all the pixels value in the kernel, different algorithms are possible. One of these is the Quicksort algorithm which chooses an arbritrary pivot number from the array (the last one for example), and will create two new arrays, the first one containing all the values lower than the pivot number, and the second one all the values greater than or equal to the pivot number. These operations are repeated on the resulting arrays, until all the resulting arrays can be concatenated in a single sorted array.

### Improved algorithms

Sorting algorithms are costly in time, and as such it is possible to improve this basic algorithm, which reorders all the pixels values in the window each time it moves, by making use of the fact that only a portion of pixel is removed from the window when it moves to the right, and the same number of pixels is added [^Hua1979][^Hua1981]. The pixel values in the window are stored inside a 256 element array hist[0:255] corresponding to the gray level histogram of the window, so that hist[g]=N mean that N pixel in the current windows take the value g. After computing the median value for the first pixel the regular way and storing it in the varable mdn, store the number of pixels in the window that have a value below the median in a variable ltmdn.  

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
and re-test. If false mdn is the median of the current window. The default median filter on ImageJ is based on this algorithm.

It is possible to further improve this algorithm by changing the way the data are stored, by using more than one gray level histogram to handle the pixels values [^Per2007].  One gray level histogram of 256 elements is maintained for each column of the image, containing a number h of pixels. By summing w of these histograms, we obtain a kernel of w X h pixels. When sliding the kernel to the right, remove the histogram corresponding to the the leftmost column and add the histogram corresponding to the column right of the previous window [Fig 1]. When moving the kernel to the next row, you remove the pixel value from the highest row from each histogram and add the pixels values from the new row included in the kernels as well.  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![alg_1](https://github.com/fsoubes/FilterRank/blob/master/images/median_algo3.png)  
#### Fig 1. (a) Moving the histogram down one row by removing a pixel and adding another one. (b) Subtracting one histogram and adding another to move the window to the right.


## Max/Min filters

** Equation 2-3 Formula of the conversion between max I and min I.**

### Naive Algorithm

A max and min filter are non-linear digital filtering techniques often used to find respectively the brightest or darkest points in an image.
A max filter operates like a median filter but will search the maximum value among the neighboring pixels instead of computing the median of the neighborhood to create the output image. Likewise, a min filter will search the minimum value of the neighborhood.


The naive algorithm for the max filter is the same as the one from the median filter, but rather than computing the median from the neighboring pixels values, instead compute the maximum value. To improve it, after computing the max value for the first pixel in the row, when moving the window to the right, compute the maximum value from the new pixels (the ones from the rightmost column). If this maximum is greater than the previous one use this new value. Else, check the pixels from the leftmost column of the previous window. If they do not contain the previous maximum value, use this value as the new maximum. Else, compute the maximum value of the new window using the naive algorithm.
### Improved algorithm

A faster algorithm will, instead of computing the output image pixel of (n-p+1) X (m-p+1) pixels directly using a 2-D window, will compute a first output image of (n-p+1) X m pixels using a 1-D window of p pixels on all the rows, then compute the second and final output image of (n-p+1) X (m-p+1) from this first output image using a 1-D window of p pixels on all the columns.  
The separability comes from the property of the maximum operator. If S and T are two sets of numbers, then

![Property of the maximun operator](https://github.com/fsoubes/FilterRank/blob/master/images/formule1.png)

** Equation 2-1: Property of the maximun operator.**

The same applies to the minimum operator : 

![Property of the min operator](https://github.com/fsoubes/FilterRank/blob/master/images/formule2.png)

** Equation 2-2: Property of the min operator.**

For the minimun filters. An easy way to obtain the result is to use and adapt the maiximun filter. In fact we can pre- and post-process the image to get the desired result, using the formula:

![Formula of the conversion between max I and min I](https://github.com/fsoubes/FilterRank/blob/master/images/minmax.png)

** Equation 2-3 Formula of the conversion between max I and min I.**

## Variance filter

In image processing, variance filter is often used for highlighting edges in the image by replacing each pixel with the neighbourhood variance. 

![GitHub Logo](https://github.com/fsoubes/FilterRank/blob/master/images/var2.png)
##### Equation_1: Variance filter is the square of the standard deviation, where u(x) is image intensity at the location x(x1, x2), σ represent the standard deviation, W is size of a filtering window, u(x-q) is the set of all pixels within the filtering window and q is an element of the set W.
![GitHub Logo2](https://github.com/fsoubes/FilterRank/blob/master/images/eq_var_2.png)

##### Equation_2: Equation used for compute the standard deviation. Where n is the total of pixels within the window (W), and ū is the mean of all the pixels within the window (W).
This filter is implemented in imageJ through the class rankfilters in <img src="https://github.com/imagej/imagej1/blob/ab7633f0f238ba08f65cb1ef5e104dba3d3f68af/ij/plugin/filter/RankFilters.java " alt="java" />. For variance algorithm, according to the input image and the size of the kernel, it will not react in the same way. If the kernel’s radius size is less than 2 (5x5), it will compute the sum over all the pixels, whereas for a kernel’s radius size greater than 2, the sum won’t be calculated. In that case this sum is calculated for the first pixel of every line only. For the following pixels, it’ll add the new values and subtract those that are not in the sum any more. This way, the computational time is then reduced. Once, the kernel reaches the end of the thread, it start over at the next line until the end of the input image. It’s notable that the variance algorithm is closely related to the mean algorithm. 
&nbsp;In application, this algorithm works by using one “window” defined here by a circular kernel, which slides, entry by entry until the end of the signal. It can process through rows or columns.
This method is simple, moreover it’s characterised by low computational complexity compared to other methods (Cany, Sobel).
However it’s not devoid of weakness because of its low resistance to noise. Indeed the impulse and Gaussian noise significantly decreases quality of edge detection [^Fab2011].

### Naive algorithm

![alg_1](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_1.png)  
![alg_2](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_2.png)  
![alg_3](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_3.png)  
![alg_4](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_4.png)  
![alg 5](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_5.png)

### Improved algorithm
Another method for variance filtering make use of a faster algorithm to compute the variance of the pixels in a window[^Sar2015]. From a starting image I, compute an image I' for which the pixel I'(x,y) take as value the sum of all pixels values in the original image between I(0,0) and I(x,y) included [Fig. 2]. Afterwards compute an image I'' for which the pixel I''(x,y) take as value the sum of all squared pixels values in the original image between I(0,0) and I(x,y) included.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![](https://github.com/fsoubes/FilterRank/blob/master/images/var_matrix_1.png)  

![](https://github.com/fsoubes/FilterRank/blob/master/images/var_matrix_2.png) 
![](https://github.com/fsoubes/FilterRank/blob/master/images/var_matrix_3.png)  

#### Fig 2. An exemple of a image I and the new computed image I' and I''.  

To compute the variance for a window B on the original image bounded by the coordinates(x,y,w,h), where x<=w and y<=h, compute :  

![EqVar2_1](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_1.gif)  
and  

![EqVar2_23](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_2.gif),  
where I'(x,y) is the sum of all pixels values between I(0,0) and I(x,y) inclusive and I''(x,y) is the sum of all squared pixels values between I(0,0) and I(x,y) inclusive. The variance of the pixels value in the window B is :  

![EqVar2_3](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_3.gif)  
Repeat for each window. The default variance filter in ImageJ is based on this algorithm.  
## Boundary issues

The kernels used in the different filters are partially out of bound of the image when centered on pixels near the boundaries of an image, and in this case there are less pixel available to compute the central value. There are multiple ways to handle these cases. The simplest way is to ignore each case where the kernel is out of bound, resulting either in an output image that is cropped compared to the input image or by keeping the border values unchanged on the output image.  Another method consists into pre-processing the image by attributing values to out of bound pixels, for example by giving them the value of the nearest in bound pixels, thus creating enough values to realise the process. This last method is used in the default RankFilters plugin of ImageJ. Another way is to attribute an arbritrary value to those out of bound pixels, for example 0,is a method called 0-padding.

![EqVar2_1](https://github.com/fsoubes/FilterRank/blob/master/images/bund_issues.png )  
#### Fig 3. Extension of the starting matrix before a treatment by a 3 X 3 filter, by (a) extending border value and by (b) 0-padding..  
A third method used to bypass boundaries issues is by shrinking the kernel near the boundaries, in order to completely fill the kernel without going out of bound during the process. This is the method used in the FastFilters plugin.


## Benchmarking analysis
Benchmark analysis is a method widely used to assess the relative performance of an object[^Fle1896]. That way, it's possible to compare the performance of various algorithms. Only execution time and memory load will be analysed here. In order to perform this benchmark, two scripts were implemented. The first script, named *benchmark2* whose aim is to compute the time speed between the start and the end of an input image coming from ImageJ during the filtering process. This script was implemented using the ImageJ macro language. The second script *memoryall.js* was implemented in javascript, to measure the memory used by the JVM while running the filter in ImageJ until the end of the process. 
The operation process is ran 1100 times for both measurements to provide robust data. In order to not recording false values we're not considering the first 100 values. Indeed during the execution, we must take into account the internal allocations of the loading images which may biased our results.

For this project the benchmark was performed with the operating system Linux (4.9.0-3-amd64)  using the 1.8.0_144 version of Java and running with the 1.51q version of ImageJ. The model image of this benchmark is Lena 512*512 pixels.


# Results
Here are shown the results of the selected images before and after selection of rank filters functions in imageJ. The image used can be found in ImageJ samples " Boats.gif".

The followed image shows the output of the Median filter function in 8-bit image[Fig.4]. Now because there is no noise on the input image it feels like the output image is kinda blurry.

![yolo](https://github.com/fsoubes/FilterRank/blob/master/images/normalmedian2.png)

#### Figure 4. Result of Median filter function with radius=2, A: input image, B: output image.**

The next image shows the output of the Median filter function on the same last image but this time with noise.[Fig.5]. With this image we can see the effect of the Median filter on an image with noise. The filter indeed removes partially the noise from the image and adversarlly 

![yolo](https://github.com/fsoubes/FilterRank/blob/master/images/noiseimagemedian2.png)

#### Figure 5. Result of Median filter function with radius=2 on a noise image, A: input image, B: output image.**

The next image shows the ouput of the Median filter function on the same image that before but this time with salt and pepper noise.[Fig.6]. We can see the full effect of the Median filter, the noise is totally removed from the picture after filter.

![yolo](https://github.com/fsoubes/FilterRank/blob/master/images/saltpepperimagemedian2.png)

#### Figure 6. Result of Median filter function with radius=2 on a salt-pepper image, A: input image, B: output image.**

The followed image shows the output of the Maximun filter function in 8-bit image[Fig.7]. Here we can clearly see the brightest points due to the Maximun filter.
![yolo2](https://github.com/fsoubes/FilterRank/blob/master/images/normalmax2.png)

#### Figure 7. Result of Maximun filter function with radius=2, A: input image, B: output image**

The followed image shows the output of the Minimun filter function in 8-bit image[Fig.8]. Here we can clearly see the darkest points in the image due to the Minimun filter.
![yolo2](https://github.com/fsoubes/FilterRank/blob/master/images/normalmin2.png)

#### Figure 8. Result of Minimun filter function with radius=2, A: input image, B: output image**

The followed image shows the output of the Variance filter function in 8-bit image[Fig.9]. On the output image we can clearly see the edges on the image represented by the pixels in white.
![yolo2](https://github.com/fsoubes/FilterRank/blob/master/images/normalvariance2.png)

#### Figure 9. Result of Variance filter function with radius=2 , A: input image, B: output image**

The following image shows the output after using both Rank filters and Fast filters plugins[Fig.10].

![Montage](https://github.com/fsoubes/FilterRank/blob/master/images/Montage.jpg )  
#### Fig. 10: Images created with a radius of 3 from the use of (a) the default median filter, (b) the default minimum filter, (c) the default maximum filter, (d) the FastFilters median filter, (e) the FastFilters minimum filter, and (f) the FastFilters maximum filters

When comparing those results,it seems that there's not much significant differences between the two different plugins. 

## Benchmark Results

The benchmark used here are based on two separated things, the execution speed and the memory usage. We also analyze the difference bewteen the inter-groups and intra-groups on the Lena image ( rbg or 8 bit), 512x512.

The results of the benchmark speed's execution on the image 8 bit and RGB are presented on the Fig. 11 on four boxplots. On the top left we can see that the median filter has still the highest time exexcution mean of 32.16 ms. The maximum and minimun filter functions have respectivly a time's execution of 17.65 and 17.63 ms. At last the variance filter function does 16.18 ms. 

On the bot-left boxplot, the same four filter functions have been studied this time with an RGB image.We can see that the median filter is a slowest compared to the others with a mean of 73.37 ms. The variance filter is the second slowest with an execution time mean of 52.28 ms. This can be epxlained because the median and variance filter algorithms are the most complex one. The  minimum and maximun filter functions are likely the same with 26.31 and 24.78 ms. Those are the two functions with the less complexity and the algorithms are likely the same this is why there is almost no difference of time's execution between those functions ( less than 2 ms). We can see the same pattern bewteen the RGB image and 8 bit image except for the variance filter function algorithm, indeed it's seems an extreme data compromised the mean of the variance function execution time.In general we see an increase of the execution time from 8 bit to RGB image. The comparison between the Fast filter functions and the Rank filter functions are interesting, indeed the fast filer functions take less time than the rank filter for each functions ( median,min,max), the variance function wasn't available so we cannot compare this last one. The same pattern is present for the Fast filter functions with an execution time from 8 bit to RBG image. We conclude that the Fast filter functions algotithms are more efficient in term of speed's execution than the Rank filter functions.


![](https://github.com/fsoubes/FilterRank/blob/master/images/boxplotresultsspedtime.png)

#### Figure 11. Comparison between the Rank filter and Fast filter functions on the exexution peed collected for 1000
iterations on lena 8 bit and RGB , OS : Linux 4.9.0-3-amd64
Java: 1.8.0_144, vm: 25.144-b01 Oracle Corporation


The results of the benchmark memory usage on the image 8 bit and RGB are presented on the Fig. 12 on four boxplots. On the top left boxplot of the figure 12 we see that the function with the most memory usage is the median filter with a mean of 9.39MB. The variance filter has a memory usage of 8.67 MB. The maximum and minimum filter are the two lowest functions with respectivly 6.89 and 5.24 MB. On a 8 bit image the  median and variance filter uses the most memory compared to all the functions, this seems logical because of the complexity of those two functions compared to the min/max ones even thought the difference is mimimal.

![](https://github.com/fsoubes/FilterRank/blob/master/images/boxploresultsmemory.png)

#### Figure 12. Comparison between the Rank filter and Fast filter functions on the memory usage  collected for 1000 iterations on lena 8 bit and RGBOS : OS : Linux 4.9.0-3-amd64
Java: 1.8.0_144, vm: 25.144-b01 Oracle Corporation

On the figure 12 we see that the variance filter function has the most memory usage with a mean of 10 MB for 1000 iterations. The Maximun functions uses 7.12 MB the median and minimum uses respectivly 6.07 and 6.96 MB. If we compared the results based on inter-groups interpretations(top left, bot left) we can say that, for memory usage on 8 bit to RGB, the median filter goes from first to last function in memory usage, it is hard to explain this result, in fact we would have expect the opposite. The other three functions have almost the same memory usage, one theory would be that the the switch between 8 bit and RGB does not impact the memory usage with those functions. Another would be that the iterations are not wide enough. The results on the Fast filter functions are presented on the boxplot top-right and bot-right. First we can see on the top-right boxplot that the mean of the three functions are almost the same, 9.26 MB, 8.86M and 10.21 MB, the functions use quite the same amount of memory.  On the bot-right boxplot the same pattern applys on the memory usage, an 8bit or RGB image does not seems to have an impact on the memory usage of the functions. If we have to compare the Rank and Fast filter functions in term of memory usage, we cannot say that there are significant differences between the Fast and Rank filter functions.

# Discussion

Four rank filter functions have been studied, the median, minimun, maximun and variance one. Each one of them have a particular effect. The median filter is used to remove speficic noise like salt and pepper. The min/max filters are used to show the darkest/brightest points in an image, and are often used before a skeletonize function, at last the variance filter is mainly use to distingish the edges. When we compare the quality of the output images between the Fast rank filter functions and the Rank ones, we do not see any difference.

The results of the benchmark on execution speed shows that the median filter function has the most complex algorithm due to the longest time's execution. The max/minx filter functions have quite the same algorithm and this one is less complex than the median. The variance filter function algorithm is the fastest one between those studied. There is some variation between 8 bit and RGB image, this was expected because of the complexity of an RGB image compared to an 8 bit image.

The results of the benchmark on memory usage shows that there is almost no differences between Rank filter and Fast filter functions. Also the results shows that the variance filter is the one with the hightest memory usage . We conclude that even if the algorithms are different this do not affect the memory usage. 

# Conclusion

From the results of the benchmarks it can be concluded that the median filter uses the most complex algorithm among the filters presented here, as the two implementation (the default ImageJ filter and the filter from the FastFilter plugin) are both significantly more time consuming than any implementation of the other filters and the time of execution is even greater on an RGB image. Also this last result has to be taken with caution. Considering that the median filter is widely used in image processing for de-noising image, improving the execution time would increase his usefulness in high-resolution images. The minimum and maximum filters are unsuprisingly of similar complexity to each other in both implementation and are the fastest of the filters presented here, while the default implementation in ImageJ of the variance filters is only slightly slower than the default minimum and maximum filters. 
It should be noted though that the FastFilters implementation of the minimum and maximum filters did not perform better on the benchmarks than the default implementation. On the other hand the FastFilters implementation of the median filter perform better than the default implementation, particularly for RGB images, justifying the use of this plugin.

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
* [^Fle1896] Philip J. Fleming and John J. Wallace. 1986. How not to lie with statistics: the correct way to summarize benchmark results. Commun. ACM 29, 3 (March 1986), 218-221. 
