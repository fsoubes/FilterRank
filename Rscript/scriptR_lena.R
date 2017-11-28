
getwd()
data<-read.csv("memorylenargb.csv",sep=";", header=TRUE, dec=".")
summary(data)
x11();
boxplot(data,main="Rank filter Benchmark Memory of lena rgb",ylab="Memory (MB)")
dev.copy(png,'memorylenargb.png')
dev.off()


x11();
data2<-read.csv("memorylena8bit.csv",sep=";", header=TRUE, dec=".")
summary(data2)
boxplot(data2,main="Rank filter Benchmark Memory of lena 8 bit",ylab="Memory (MB)")
dev.copy(png,'memorylena8bit.png')
dev.off()



x11();
data3<-read.csv("speedtimelenargb.csv",sep=";", header=TRUE, dec=".")
summary(data3)
boxplot(data3,main="Benchmark Speed time of lena RGB",ylab="Time (ms)")
dev.copy(png,'speedlenargb.png')
dev.off()

x11();
data4<-read.csv("speedtimelena8bit.csv",sep=";", header=TRUE, dec=".")
summary(data4)
boxplot(data4,main="Benchmark Speed time of lena 8 bit",ylab="Time (ms)")
dev.copy(png,'speedlena8bit.png')
dev.off()


### FAST FILTERS memory
x11();
data5<-read.csv("memoryfast8bit.csv",sep=";", header=TRUE, dec=".")
summary(data5) 
boxplot(data5,main="Fast filter Benchmark memory 8 bit","Memory (MB)")


x11();
data6<-read.csv("memoryfastrgb.csv",sep=";", header=TRUE, dec=".")
summary(data6) 
boxplot(data6,main="Fast filter Benchmark memory RGB","Memory (MB)")

x11();
data7<-read.csv("speedfastfilter8bit.csv",sep=";", header=TRUE, dec=".")
summary(data7) 
boxplot(data7,main="Fast filter Benchmark speed time 8 bit",ylab=" Time (ms)")

x11();
data8<-read.csv("speedfastfilterrbg.csv",sep=";", header=TRUE, dec=".")
summary(data8) 
boxplot(data8,main="Fast filter Benchmark speed time RGB",ylab=" Time (ms)")


### MULTI BOXPLOT RANK VS FAST FILTER AGAINST 8 AND RBG IMAGE on MEMOMRY

x11();
par (mfrow=c(2,2))
boxplot(data2,main="Rank filter Benchmark Memory 8 bit",ylab="Memory (MB)")
boxplot(data5,main="Fast filter Benchmark memory 8 bit","Memory (MB)")
boxplot(data,main="Rank filter Benchmark Memory RGB",ylab="Memory (MB)")
boxplot(data6,main="Fast filter Benchmark memory RGB","Memory (MB)")
dev.copy(png,'MemoryFinal.png')
dev.off()

###  MULTI BOXPLOT RANK VS FAST FILTER AGAINST 8 AND RBG IMAGE ON SPEED EXECUTION


x11();
par (mfrow=c(2,2))
boxplot(data4,main="Rank filter Benchmark speed time 8 bit",ylab="Memory (MB)")
boxplot(data7,main="Fast filter Benchmark speed time 8 bit",ylab=" Time (ms)")
boxplot(data3,main="Rank filter Benchmark Speed time RGB",ylab="Time (ms)")
boxplot(data8,main="Fast filter Benchmark speed time RGB",ylab=" Time (ms)")





