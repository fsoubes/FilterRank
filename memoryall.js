imp = IJ.openImage("http://wsr.imagej.net/images/lena-std.tif");
IJ.run(imp, "8-bit", "");
// liste of functions we need to test
functions=["Median...","Minimum...","Maximum...","Variance..."];
fast_filters=["median","minimum","maximum"];
// loop to apply each function and reset memory after each 100 //iterations of each function
for (var i=0; i<fast_filters.length;i++){
    fast_filterss = fast_filters[i];
    memory(imp,fast_filterss);
    IJ.freeMemory();
    
}



// memory function, loop of 100 iterations using the defined //function, add the memory of each iteration, then calculate the //average and then convert it into MB (binary)
function memory(imp,fast_filterss){
	var memory = 0;
	
    for (var i=0; i<100; i++){

	    IJ.freeMemory();
	    dupl = imp.duplicate();
	    
	    //IJ.run(dupl,filter_function,"radius = 2")
	    IJ.run(imp, "Fast Filters", "link filter="+fast_filterss+" x=5 y=5 preprocessing=none offset=128");
	    var memory = IJ.currentMemory();
	    memory+=memory
	    dupl.close();
    }
    IJ.log(memory);
    var mean_memory = memory/100;
// 1 Byte = 0.00000095367432 MB
    var bbytes_to_mb=mean_memory/1048576;
    IJ.log("average memory is :"+bbytes_to_mb+"MB.");
}
