#ifndef SCALAR_FIELD_H
#define SCALAR_FIELD_H

#include <GL/glew.h>
#include <OpenGL/gl.h>
#include <string>
#include <cmath>

#include "shader_primitive.h"
#include "function.h"
#include "color.h"

namespace glot {

	/** \brief scalar_field: a scalar field to plot
	  *
		* This class takes a scalar-valued function of x,
		* y and t and renders the resulting scalar field
		* with a fragment shader.  The shader expects the
		* value of the function to be scaled between -1 and
		* 1 and will clamp any value outside of that. (For
		* instance, -10 gets mapped to the color for -1 and
		* 1220 gets mapped to the value for 1).
		*
		* Future versions will allow for a user-specified
		* range, and ideally would also have a mode that 
		* automatically scales the values appropriately.
		*
		* \sa grapher
		* \sa p_curve
	  */
	class scalar_field : public shader_primitive {
	
		public:
		
			/** Constructor
			  *	\param func - the function to render
			  */
			scalar_field(const string& f) : shader_primitive(), func(f) {
				gen_shader();
			};
			
			/** Display-list generator
			  * \param s - the screen specs of the plot
			  *
			  * Generates a screen-filling quad that serves
			  * as the canvas for the fragment shader to do
			  * its thing.
			  */
			void dl_gen(const screen& s);
		
		private:
		
			/** Shader generator
				* 
				* Manages the compiling, linking, etc for the 
				* shader program it will use.
			  */
			void gen_shader();
		
			// This is the function it's meant to plot.
			string func;
	
	};
	
}

#endif
