#ifndef STOPWATCH_CPP
#define STOPWATCH_CPP

#include "stopwatch.h"

void stopwatch::start() {
	gettimeofday(&s, NULL);
	t = -1;
}

double stopwatch::time() {
	gettimeofday(&tmp, NULL);
	return (t = (tmp.tv_sec - s.tv_sec + ((double)(tmp.tv_usec - s.tv_usec) / 1000000.0)));	
}

double stopwatch::stop() {
	gettimeofday(&tmp, NULL);
	return (t = (tmp.tv_sec - s.tv_sec + ((double)(tmp.tv_usec - s.tv_usec) / 1000000.0)));
}


#endif