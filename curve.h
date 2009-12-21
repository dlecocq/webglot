#ifndef CURVE_H
#define CURVE_H

#include <GL/glew.h>
#include <string>
#include <cmath>

#include "shader_primitive.h"
#include "function.h"
#include "color.h"

namespace glot {

	/** \brief curve: a curve to plot
	  *
		* This class takes a function that accepts a double
		* and returns a double and does its best to plot it
		* in the grapher.
		*
		* \sa grapher
		* \sa p_curve
	  */
	class curve : public shader_primitive {
	
		public:
			
			/** Color variable
			  *
			  * This is the color the curve is supposed to
			  * take on.
			  */
			color c;
		
			/** Constructor
			  *	\param func - the function to render
			  *	\param col - the color of the curve
			  */
			curve(string f, const color& col, short int layout_opt = X_LIN | Y_LIN) : shader_primitive(col, layout_opt), func(f) {
				gen_shader();
			};
			
			void dl_gen(const screen& s);
		
		private:
		
			void gen_shader();
			
			string get_frag_shader();
			string get_vert_shader();
			string get_geom_shader();
			
			GLhandleARB f;
			GLhandleARB g;
			GLhandleARB v;
		
			// This is the function it's meant to plot.
			string func;
	
	};
	
}

#endif
