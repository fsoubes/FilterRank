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
## Benchmarking analysis
Benchmarking analysis is a method widely used to assess the relative performance of an object[^Fle1896]. That way, it's possible to compare the performance of various algorithms. Only execution time and memory load will be analysed here. In order to perform this benchmark, two scripts were implemented. The first script, named *benchmark2* whose aim is to compute the time speed between the start and the end of an input image coming from ImageJ during the filtering process. This script was implemented using the ImageJ macro language. The second script *memoryall.js* was implemented in javascript, to measure the memory used by the JVM while running the filter in ImageJ until the end of the process. 
The operation process is ran 1100 times for both measurements to provide robust data. In order to not recording false values we're not considering the first 100 values. Indeed during the execution, we must take into account the internal allocations of the loading images which may introduce error in our measurement.

For this project the benchmark was performed with the operating system Linux (4.9.0-3-amd64)  using the 1.8.0_144 version of Java and running with the 1.51q version of ImageJ. The model image of this benchmark is Lena 512*512 pixels.
