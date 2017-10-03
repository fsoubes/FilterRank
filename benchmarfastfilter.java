best = 100000;
worst = -1;
count = 100;
sum = 0;
for(i=0; i<count; i++){
    open("/net/cremi/gdebra910e/Bureau/ImageJ_2/samples/lenargb.png");
    id = getImageID;
    t = getTime();
    run("Fast Filters", "link filter=mean x=2 y=2 preprocessing=none offset=128");
    // run("Median...", "radius=2");
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
