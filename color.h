#ifndef COLOR_H
#define COLOR_H

namespace glot {

	class color {

		public:
		
			/** Constructor
			  * \param red - red component of color
			  * \param green - green component of color
			  * \param blue - blue component of color
			  * \param alpha - the transparency of the color
			  */
			color(double red = 0, double green = 0, double blue = 0, double alpha = 1) : r(red), g(green), b(blue), a(alpha) {};
		
			/** The red component of the color */
			double r;
			
			/** The green component of the color */
			double g;
			
			/** The blue component of the color */
			double b;
			
			/** The transparency of the color (1 = opaque) */
			double a;
	
	};
	
}

#endif
