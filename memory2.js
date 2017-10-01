
// liste of functions we need to test
functions=["Median...","Minimum...","Maximum...","Variance..."];

// loop to apply each function and reset memory after each 100 //iterations of each function
for (var i=0; i<functions.length;i++){
    filter_function = functions[i];
    memory(filter_function);
    IJ.freeMemory();
    
}



// memory function, loop of 100 iterations using the defined //function, add the memory of each iteration, then calculate the //average and then convert it into MB (binary)
function memory(filter_function){
    for (var i=0; i<100; i++){
	IJ.freeMemory();
	image= IJ.openImage("/D:/ImageJ/plugins/boats.tif");
	IJ.run(image,filter_function,"radius = 2");
	var memory = IJ.currentMemory();
	memory+=memory
    }
    var mean_memory = memory/100;
// 1 Byte = 0.00000095367432 MB
    var bbytes_to_mb=mean_memory/1048576;
    IJ.log("average memory is :"+bbytes_to_mb+"Mb.");
}


