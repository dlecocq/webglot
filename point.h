#ifndef POINT_H
#define POINT_H

#include <cstdlib>

#include "color.h"

namespace glot {
	
	class point {
	
		public:
		
			/** The color of the the point */
			color c;
			
			/** The x coordinate of the point */
			double x;
			
			/** The y coordinate of the point */
			double y;
			
			/** The z coordinate of the point */
			double z;
		
			/** Constructor
			  * \param i - the x coordinate of the point
			  * \param j - the y coordinate of the point
			  * \param k - the z coordinate of the point
			  * \param col - the color with which to draw
			  */
			point(double i, double j, double k, const color& col = NULL) : c(col), x(i), y(j), z(k) {};
		
		private:
	
	};

}

#endif
