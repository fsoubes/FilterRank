
//Benchmarking macro
//Penser à changer le path vers les images utilisé

print("- - - ");
print("ImageJ: " + getVersion());
print("OS : " + getInfo("os.name") + " " + getInfo("os.version"));
print("Java: "+ getInfo("java.version") + ", vm: " + getInfo("java.vm.version") + " " + getInfo("java.vm.vendor"));

best = 100000;
worst = -1;
count = 100;
sum = 0;
for(i=0; i<count; i++){
    open("/net/cremi/gdebra910e/Bureau/ImageJ_2/samples/lenargb.png");
    id = getImageID;
    t = getTime();    
    run("Median...", "radius=2");
    t2 = getTime()-t;
    print(t2);
    close();
    if (t2<best) best = t2;
    if (t2>worst) worst = t2;
    sum = sum+t2;
}
print("Benchmak filtre median");
print("Benchmark mean: " + sum/count);
print("Benchmark best: " + best);
print("Benchmark worst: " + worst);

best = 100000;
worst = -1;
count = 100;
sum = 0;
for(i=0; i<count; i++){
    open("/net/cremi/gdebra910e/Bureau/ImageJ_2/samples/lenargb.png");
    id = getImageID;
    t = getTime();    
    run("Minimum...", "radius=2");
    t2 = getTime()-t;
    print(t2);
    close();
    if (t2<best) best = t2;
    if (t2>worst) worst = t2;
    sum = sum+t2;
}
print("Benchmak filtre minimun");
print("Benchmark mean: " + sum/count);
print("Benchmark best: " + best);
print("Benchmark worst: " + worst);

best = 100000;
worst = -1;
count = 100;
sum = 0;
for(i=0; i<count; i++){
    open("/net/cremi/gdebra910e/Bureau/ImageJ_2/samples/lenargb.png");
    id = getImageID;
    t = getTime();    
    run("Maximum...", "radius=2");
    t2 = getTime()-t;
    print(t2);
    close();
    if (t2<best) best = t2;
    if (t2>worst) worst = t2;
    sum = sum+t2;
}
print("Benchmak filtre maximun");
print("Benchmark mean: " + sum/count);
print("Benchmark best: " + best);
print("Benchmark worst: " + worst);

best = 100000;
worst = -1;
count = 100;
sum = 0;
for(i=0; i<count; i++){
    open("/net/cremi/gdebra910e/Bureau/ImageJ_2/samples/lenargb.png");
    id = getImageID;
    t = getTime();    
    run("Variance...", "radius=2");
    t2 = getTime()-t;
    print(t2);
    close();
    if (t2<best) best = t2;
    if (t2>worst) worst = t2;
    sum = sum+t2;
}
print("benchmard variance");
print("Benchmark mean: " + sum/count);
print("Benchmark best: " + best);
print("Benchmark worst: " + worst);
