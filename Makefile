CC = g++
CCOPT = -O3 -Wall -g

FORMAT = TIFF

DEFINES = -DUSE_$(FORMAT)

LIBOPT = -framework GLUT -framework OpenGL -lGLEW

DEPENDENCIES = grapher.o function.o curve.o p_curve.o point.o vector.o contour.o scalar_field.o stopwatch.o shader_primitive.o flow.o

EXECUTABLE = glot

all : $(EXECUTABLE)

$(EXECUTABLE) : driver.o $(DEPENDENCIES)
	$(CC) $(CCOPT) -o $(EXECUTABLE) driver.o $(DEPENDENCIES) $(LIBOPT)
	
driver.o : driver.cpp Makefile
	$(CC) $(CCOPT) -c driver.cpp

%.o : %.cpp %.h
	$(CC) $(CCOPT) $(DEFINES) -c $<

clean :
	rm -rdf $(DEPENDENCIES) $(EXECUTABLE) driver.o *~
	
tarball : $(SOURCE)
	cd ..
	mv src openglot
	tar -cvzf openglot.tar.gz openglot
	mv openglot src
	cd src
	