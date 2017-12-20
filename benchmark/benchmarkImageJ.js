//Benchmarking macro
//Penser à changer le path vers les images utilisé
/*
print("- - - ");
print("ImageJ: " + getVersion());
print("OS : " + getInfo("os.name") + " " + getInfo("os.version"));
print("Java: "+ getInfo("java.version") + ", vm: " + getInfo("java.vm.version") + " " + getInfo("java.vm.vendor"));*/
/*
imageType = ["8-bit", "16-bit", "32-bit"];
imageWidth = ["180", "360", "540", "720", "900"];
imageHeight = ["144", "288", "432", "576", "720"];
filterFunction = ["Median...", "Minimum...", "Maximum...", "Variance..."];*/

open("boats.gif");

count=1000;
run("8-bit", "");
run("Size...", "width=180 height=144 constrain average interpolation=Bilinear");
sum = 0
for (var i=0; i<count; i++){
    t = getTime(); 
    run("Median...", "radius=2");
    t2 = getTime()-t;
    sum=sum+t2;
}    
print('Took', sum/count, 'milliseconds to generate');
run("Size...", "width=360 height=288 constrain average interpolation=Bilinear");
sum = 0
for (var i=0; i<count; i++){
    t = getTime(); 
    run("Median...", "radius=2");
    t2 = getTime()-t;
    sum=sum+t2;
}    
print('Took', sum/count, 'milliseconds to generate');
run("Size...", "width=540 height=432 constrain average interpolation=Bilinear");
sum = 0
for (var i=0; i<count; i++){
    t = getTime(); 
    run("Median...", "radius=2");
    t2 = getTime()-t;
    sum=sum+t2;
}    
print('Took', sum/count, 'milliseconds to generate');
run("Size...", "width=720 height=576 constrain average interpolation=Bilinear");
sum = 0
for (var i=0; i<count; i++){
    t = getTime(); 
    run("Median...", "radius=2");
    t2 = getTime()-t;
    sum=sum+t2;
}    
print('Took', sum/count, 'milliseconds to generate');
run("Size...", "width=900 height=720 constrain average interpolation=Bilinear");
sum = 0
for (var i=0; i<count; i++){
    t = getTime(); 
    run("Median...", "radius=2");
    t2 = getTime()-t;
    sum=sum+t2;
}    
print('Took', sum/count, 'milliseconds to generate');
run("16-bit", "");
run("32-bit", "");








/*
IJ.run(imp, "8-bit", "");
IJ.run(imp, "Size...", "width=1800 height=1440 constrain average interpolation=Bilinear");
imp.show();*/
