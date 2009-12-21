#ifndef VECTOR_H
#define VECTOR_H

#include <OpenGL/gl.h>

#include "primitive.h"
#include "color.h"
#include "point.h"

namespace glot {
	
	class vector : public primitive {
	
		public:
		
			/** The color of the the point */
			color c;
			
			/** The endpoints of the vector */
			point start, end;
		
			/** Constructor
			  * \param s - the start point
			  * \param e - the end point
			  * \param col - the color with which to draw
			  */
			vector(const point& s, const point& e, const color& col) : primitive(col), start(s), end(e) {};
			
			void dl_gen(const screen& s);
		
		private:
	
	};

}

#endif
