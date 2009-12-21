#include <iostream>
#include <cmath>

#include "grapher.h"

using namespace std;
using namespace glot;

typedef contour my_prim;

int main(int argc, char ** argv) {
	
	grapher::initialize(argc, argv, X_LIN | Y_LIN | AXES_ON | GRID_ON);
	
	color col(1.0, 0, 0);
	//*
	if (argc > 1) {
		for (int i = 1; i < argc; ++i) {
			my_prim * p = new my_prim(argv[i], col);//, 0, 2 * 3.14159265, X_LIN | Y_LIN | POLAR);
			grapher::add(*p);
		}
	}
	grapher::set_idle_function(grapher::redraw);
	//*/
	
	/*
	grapher::set_idle_function(grapher::redraw);
	grapher::set_click_function(my_click);
	//*/
	
	//atexit(utilities::stop_record);
	
	grapher::run();
	
	return 0;
};
