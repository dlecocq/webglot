#ifndef CONTOUR_H
#define CONTOUR_H

#include <GL/glew.h>

#include <string>

#include "shader_primitive.h"
#include "color.h"

using namespace std;

namespace glot {

	/** \brief curve: a contour to plot
	  *
		* This class maps a scalar function of two variables
		* to a 2-d plot showing the iso-curve z = 0
		*
		* \sa grapher
	  */
	class contour : public shader_primitive {
	
		public:
		
			/** Constructor
			  *	\param f - A function of x, y and t
			  *	\param col - the color of the curve
			  *
			  * The function may use x, y and t and any combination
			  * of C-available functions.  Rather, any C-available
			  * functions supported by the OpenGL Shading Language
			  * (GLSL) which includes most.
			  *
			  * NOTE: GLSL is very picky about typecasting. When using
			  * integer values use the float equivalent instead:
			  * (Use 1.0 not 1, 93.0 not 93)
			  */
			contour(const string& f, const color& col) : shader_primitive(col), func(f) {
				gen_shader();
			};
			
			/** Display-list generator
			  * \param scr - The specifications of the screen
			  *
			  * This returns the geometry appropriate for the geometry
			  * shader used here. In this case, it's a set of line
			  * segments that specify a bounding square for which
			  * the shader should find the iso-curve.  That is, a line
			  * from (x_min, y_min) to (x_max, y_max)
			  */
			void dl_gen(const screen& scr);
		
		private:
			
			/** Generate the shader program
				*
				* This aggregates all the shader source, compiles it,
				* links it and reports errors in the process.  After
				* calling this function, the shader program should be
				* ready to use if there are no syntactic errors in
				* the program.
				*
				* NOTE: The constructor calls this function and so in
				* general there is no need to call it explicitly.
			  */
			void gen_shader();
			
			/** Return the vertex shader source
			  *
			  * This is a simple wrapper function that concatenates
			  * all relevant parts of the vertex shader source and
			  * returns it in a string.
			  */
			string get_vert_shader();
			
			/** Return the geometry shader source
			  *
			  * This is a simple wrapper function that concatenates
			  * all relevant pars of the geometry shader source and
			  * returns it in a string
			  */
			string get_geom_shader();
			
			// This is the function it's meant to plot.
			string func;
	
	};
	
}

#endif
