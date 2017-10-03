
getwd()
data<-read.csv("memorylenargb.csv",sep=";", header=TRUE, dec=".")
summary(data)
x11();
boxplot(data,main="Benchmark Memory of lena rgb",ylab="Memory (MB)")
dev.copy(png,'memorylenargb.png')
dev.off()


x11();
data2<-read.csv("memorylena8bit.csv",sep=";", header=TRUE, dec=".")
summary(data2)
boxplot(data2,main="Benchmark Memory of lena 8 bit",ylab="Memory (MB)")
dev.copy(png,'memorylena8bit.png')
dev.off()
