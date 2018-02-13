# Filters 2D (rank filters = Variance)
# AUTHORS : *Franck Soubès
# Link to <img src="https://github.com/fsoubes/FilterRank " alt="our project GitHub" />
# 1.Introduction

&nbsp;&nbsp;Since image have been digitized on a computer's memory, it has been possible to interact in new ways with those images that were otherwise impossible. This is called image proccessing, and it consist of methods used to perform operations on a digital image. Those methods are described with various algorithms that can be used for various purposes in multiple fields. Those applications are used for noise filtering and other image enhancement as well as extracting information from images. In this project, will be examined the algorithms used for three types of 2D rank filters : median, min&max and variance.  

&nbsp;&nbsp;  By definition rank filters are non-linear filters using the local gray-level ordering to compute the filtered value[^Soi2002] . The output of the filter is the pixel value selected from a specified position in this ranked list. The ranked list is represented by all the grey values that lies within the window which are sorted, from the smallest to the highest value.
For an identical window the pixel value will differ in function of the filters used (median, min, max and variance). Moreover the size of the window is also influencing the output pixel. 
The variance filter is used to edge detection. Edges can be detected using the 1st (Sobel or Cany approaches[^Can1986][^Kit1983]) or 2nd deriviates(Log approach[^Mar1980]) of the grey level intensity. Nevertheless there's other alternatives using synthetic and real images with the variance filter[^Fab2011] or simply with a simple formula. The three filters have their own field of expertise. They can be used for removing noise (median filter), detecting edge (variance filter) and mathematical morphology(min/max filters). The main issues of these filters algorithm are their slowness, to overcome these problems the use of small windows and/or low resolution images is required[^Wei2006]. The last part of this project include an implementation of our algorithm with Webgl[!cite] in order to highly increase the performance of the agorithm while using gpu.


&nbsp;&nbsp;  In this report, we shall begin by describing the main algorithm with the cpu and then explain how to implement it in webgl . 
* Variance filter

Next step will be to perform a benchmark on different imageJ plugins, with the objective of comparing their performances such as execution time and the memory load for the Java Virtual Machine (JVM). The ImageJ plugins compared are the default ImageJ RankFilters plugin which has implementation for the median, maximum, minimum and variance filters.




# 2.Material & Methods

## Implementation of the variance filter

## Variance filter

In image processing, variance filter is often used for highlighting edges in the image by replacing each pixel with the neighbourhood variance. 

![GitHub Logo](https://github.com/fsoubes/FilterRank/blob/master/images/computational.png)
##### Equation_1: Variance filter is computed here by substracting the sum of the pixel square with two times the sum divided by the number of pixels in the kernel and overall divided by the number of pixels - 1 this method correspond to the naive algorithm.


This filter is implemented in imageJ through the class rankfilters in java. For variance algorithm, according to the input image and the size of the kernel, it will not react in the same way. If the kernel’s radius size is less than 2 (5x5), it will compute the sum over all the pixels, whereas for a kernel’s radius size greater than 2, the sum won’t be calculated. In that case this sum is calculated for the first pixel of every line only. For the following pixels, it’ll add the new values and subtract those that are not in the sum any more. This way, the computational time is then reduced. Once, the kernel reaches the end of the thread, it start over at the next line until the end of the input image. It’s notable that the variance algorithm is closely related to the mean algorithm. 
&nbsp;In application, this algorithm works by using one “window” defined here by a circular kernel, which slides, entry by entry until the end of the signal. It can process through rows or columns.
This method is simple, moreover it’s characterised by low computational complexity compared to other methods (Cany, Sobel).
However it’s not devoid of weakness because of its low resistance to noise. Indeed the impulse and Gaussian noise significantly decreases quality of edge detection [^Fab2011].

### Naive algorithm

The basic method describe here, use a kernel that can be of different types (circular, square, diamond ...) and slide over the pixels by modifying them one by one. By definition the modifying pixel is always the central pixel. Hence, a kernel is generally always represented by odd values (3x3,5x5). In the field of the imagerie this process is referred to the convolution and it's widely use for image processing. The example below explain how a convolution mask operate over an image.    

![alg_1](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_1.png)  
![alg_2](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_2.png)  
![alg_3](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_3.png)  
![alg_4](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_4.png)  
![alg 5](https://github.com/fsoubes/FilterRank/blob/master/images/alg_var_5.png)

### Integral image algorithm

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

To compute the variance for a window B on the original image bounded by the coordinates(x,y,w,h), where x<=w and y<=h, compute :  

![EqVar2_1](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_1.gif)  
and  

![EqVar2_23](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_2.gif),  
where I'(x,y) is the sum of all pixels values between I(0,0) and I(x,y) inclusive and I''(x,y) is the sum of all squared pixels values between I(0,0) and I(x,y) inclusive. The variance of the pixels value in the window B is :  

![EqVar2_3](https://github.com/fsoubes/FilterRank/blob/master/images/EqVar2_3.gif)  

### Choice of algorithm for webgl implementation

The naive algorithm is used for computing the variance with the convolve and also for the webgl implementation. The main reason to use this algorithm is that it can be computed in one pass. The method with the convolve was implemented by JC Taveau, while I implemented an other method based on integral image[!cite  Grzegorz Sarwas
and Sławomir Skoneczny, Object Localization and Detection Using Variance Filter] these algorithms are running only with the CPU. However, the previous method is not that performant as described in the benchmark and it's rather difficult to implement it in webgl. Hence, the one pass algorithm was picked mainly for the performance and it's the same algorithm that in ImageJ.

### Webgl implementation


## Benchmarking analysis
Benchmarking analysis is a method widely used to assess the relative performance of an object[^Fle1896]. That way, it's possible to compare the performance of various algorithms. Only execution time and memory load will be analysed here. In order to perform this benchmark, one script was implemented. The first script, named *benchmark2* whose aim is to compute the time speed between the start and the end of an input image coming from ImageJ during the filtering process. This script was implemented using the ImageJ macro language. 
The operation process is run 1000 times for ImageJ measurements to provide robust data. In order to not recording false values we're not considering the first 100 values. Indeed during the execution, we must take into account the internal allocations of the loading images which may introduce error in our measurement. For our own algorithm we did only 50 iterations because of the amount of time that each algorithm takes.

For this project the benchmark was performed with the operating system Linux (4.9.0-3-amd64)  using the 1.8.0_144 version of Java and running with the 1.51q version of ImageJ. The model image of this benchmark is Lena for various pixels size.
# 3.Results

## Image result comparison between ImageJ, CPU and GPU

### Variance filter 

The following figure shows the result of our _variance_ function for a boat of 720x576 pixels taking as parameter a kernel of diameter = 3 compared to the variance filter of ImageJ with a kernel radius = 1. The results are different for mainly two reasons one is that the luminosity between B and C are different and the fact that the kernel on ImageJ is circular whereas our kernel is square.

![](https://github.com/fsoubes/FilterRank/blob/master/images/merge_from_ofoct.jpg)
#### Fig 9. Result of a variance processing for the method based on integral image  with (A) representing the original image, (B),(C) and (D) are respectively corresponding to the ImageJ _variance_, our _variance_ function and the substraction of those two (B-C).

The following figure shows the result of J.C Taveau variance (One-pass algorithm ) for a boat of 720x576 pixels taking as parameter a kernel of diameter = 3 compared to the variance filter of ImageJ with a kernel radius =1. The results are different for mainly two reasons one is that the luminosity between B and C are different and the fact that ImageJ adjust the brightness and contrast of the image after the process

![](https://github.com/fsoubes/FilterRank/blob/master/images/Montagecpuvariance.jpg)
#### Fig 9. Result of a variance processing for the  One-pass algorithm (CPU)  with (A) representing the original image, (B),(C) and (D) are respectively corresponding to the ImageJ _variance_, our _variance_ function and the substraction of those two (B-C) for a circular kernel of radius = 1.

The following figure shows the result of our gpu implementation of variance (One-pass algorithm ) for a boat of 720x576 pixels taking as parameter a kernel of diameter = 3 compared to the variance filter of ImageJ with a kernel radius = 1.The results are different for mainly two reasons one is that the luminosity between B and C are different and the fact that ImageJ adjust the brightness and contrast of the image after the process. Moreover, we obtain the same result between the GPU and CPU based on the substraction that's logic because the variance is computed with the same algorithm.

![](https://github.com/fsoubes/FilterRank/blob/master/images/Montagegpuvariance.jpg)
#### Fig 9. Result of a variance processing for the  One-pass algorithm (GPU)  with (A) representing the original image, (B),(C) and (D) are respectively corresponding to the ImageJ _variance_, our _variance_ function and the substraction of those two (B-C) for a circular radius = 1.


## Benchmark comparison between ImageJ, CPU and GPU for the variance filter

### Benchmark integral image vs one pass algorithm for a kernel radius = 1
A comparative benchmark for our own  Variance filter based on integral image against the Variance filter based on a single has been done with a set of 7 images for seven different resolution  360x288, 720x576, 900x720, 1080x864, 1440x1152, 1880x1440 and 2880x2304. Each set of 3 images have the same resolution but with a different type, either 8bit, 16bit or float32. The benchmark representation is represented down below :
	
![](https://github.com/fsoubes/FilterRank/blob/master/images/montagecpucpu964x339.jpg)
#### Fig 15. Execution time benchmark analysis with two different methods to compute the variance, one based on integral image (left) against single pass method (right) for a circular kernel of radius = 1. 

On the figure 15, the execution time for either 8bit, 16bit or float32 for an image with the same resolution does not change significantly on either resolution, infact the 3 lines which represent the execution time are close together between the two methods except for the 8 bit filter that is way more faster than for the two other types because of the low complexity values [0...256]. However, the two methods differ by a factor of 1000, that can be explain by the fact that for the integral image's method it iterates many times through the image to compute the variance whereas the one pass only iterate once. Hence, the single pass method 
fit more to a GPU implementation  mainly because of his execution time, way more faster  than the integral image method and easier to implemant.  


### Benchmark CPU vs GPU and ImageJ for two different kernel size.

This part is mainly focused on demonstrate the gap between the CPU implementation of the single pass against the GPU and ImageJ implementation of the variance filter . 

![](https://github.com/fsoubes/FilterRank/blob/master/images/Montageall964x339.jpg) 
#### Fig 16. Execution time of the variance filter for three different implementation of the one passe algorithm with ImageJ, CPU and GPU with the same algorithm. The left image represent the execution time of the variance filter for a kernel radius = 1 when the right image represent the execution time of the variance filter for a kernel radius = 3. 

On the figure 16,  the increase of the execution time for both ImageJ and GPU stays globally the same for the different resolutions while the CPU highly increased. Indeed for a kernel radius the difference between the two differ by a factor of nearly 500/600 for a resolution of  1880x1440 pixels when it's triple for a resolution of  2880x2304  pixels with a factor close to 1500. The same pattern can be seen for a radius equal to 3 except that's the execution time for the cpu is 2000 better for a resolution of 1880x1440 pixels and three times more for the next resolution.

### Benchmark GPU vs ImageJ

As we previously described that the GPU and ImageJ implementation are more faster than the CPU in term of execution time, what about the performance between the GPU and ImageJ for two different kernel. 

![](https://github.com/fsoubes/FilterRank/blob/master/images/Montagegpuvsij964x339.jpg) 
#### Fig 16. Execution time benchmark analysis against the variance algorithm of ImageJ for a kernel size = 3, filter = Variance. 




# 4.Discussion

## Overall quality comparison between imageJ, CPU and GPU for the variance filter.

## Overall performance comparison between imageJ, CPU and GPU for the variance filter.

# 5.Conclusion
In general, the execution time of every algorithm implemented are slower than the ImageJ  especially for high resolution images. The min_max and median algorithm have higher exexution time than the variance algorithm, however we do obtain close results for the similarity of the output images for each algorithm.
For each algorithm we did try to functionalize as much as we could, and curried our functions delivering  fonctional algorithms which work with 8 bit,16bit and float32 images
Finally the different algorithms respect what was developped in the first markdown for instance the min_max algorithm respects the process of 1D filter after 1D filter described in the first markdown, and the variance algorithm respects the algorithm proposed to calculate the variance of an image. On the other hand, the median filter has been implemented using a naive algorithm because the attempted implementation of the Huang algorithm ended more time consuming.

## References

[^Hua1979]: Huang T, Yang G, Tang G. A fast two-dimensional median filtering algorithm. IEEE Transactions on Acoustics, Speech, and Signal Processing. 1979;27(1):13–18.  

[^Hua1981]: Huang TS. Two-dimensional digital signal processing II: transforms and median filters. Springer-Verlag New York, Inc.; 1981.

[^Wei2006]: Weiss B. Fast median and bilateral filtering. 2006;25(3):519–526.
Acm Transactions on Graphics (TOG).  
 

[^Gil1993]: Gil J, Werman M. Computing 2-D min, median, and max filters. IEEE Transactions on Pattern Analysis and Machine Intelligence. 1993;15(5):504–507.  

[^Fab2011]: Fabijańska A. Variance filter for edge detection and edge-based image segmentation. In: Perspective Technologies and Methods in MEMS Design (MEMSTECH), 2011 Proceedings of VIIth International Conference on. IEEE; 2011. p. 151–154.  

[^Sar2015]: Sarwas G, Skoneczny S. Object localization and detection using variance filter. In: Image Processing & Communications Challenges 6. Springer; 2015. p. 195–202.  

[^Vio2001]: Viola P, Jones M. Rapid object detection using a boosted cascade of simple features. In: Computer Vision and Pattern Recognition, 2001. CVPR 2001. Proceedings of the 2001 IEEE Computer Society Conference on. vol. 1. IEEE; 2001. p. I–I.  


[^Soi2002]: Soille P. On morphological operators based on rank filters. 2002;35(2):527–535. Pattern recognition.  

[^Tuk1974]: Tukey J. Nonlinear (nonsuperposable) methods for smoothing data. Congr Rec 1974 EASCON. 1974;673.  

[^Wer1985]: Werman M, Peleg S. Min-max operators in texture analysis. IEEE transactions on pattern analysis and machine intelligence. 1985;(6):730–733.  

[^Can1986]: Canny J. A computational approach to edge detection. IEEE Transactions on pattern analysis and machine intelligence. 1986;(6):679–698.  

[^Kit1983]: Kittler J. On the accuracy of the Sobel edge detector. 1983;1(1):37–42. Image and Vision Computing. 

[^Mar1980]: Marr D, Hildreth E. Theory of edge detection. Proceedings of the Royal Society of London B: Biological Sciences 1980;207(1167):187–217.

[^Fle1896]: Philip J. Fleming and John J. Wallace. 1986. How not to lie with statistics: the correct way to summarize benchmark results. Commun. ACM 29, 3 (March 1986), 218-221.

[^BRA2007]: Bradley D, Roth G. Adaptive thresholding using integral image. Journal of Graphics Tools. Volume 12, Issue 2. pp. 13-21. 2007. NRC 48816.

[^SHI2017]: Shivani Km, A Fast Integral Image Computing Methods: A Review Design Engineer, Associated Electronics Research Foundation, C-53, Phase-II, Noida (India)
