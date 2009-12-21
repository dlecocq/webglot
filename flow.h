#ifndef FLOW_H
#define FLOW_H

#include <GL/glew.h>

#include <string>

#include "shader_primitive.h"
#include "color.h"

using namespace std;

namespace glot {

	/** \brief flow: a vector-valued function as a flow field
	  *
		* This class represents a vector-valued function of x,
		* y and t as a flow field using streamlines. It uses
		* fourth-order Runge-Kutta integration to determine the
		* next points in the line, and along the line linearly
		* increases the alpha value.  This is contrary to the
		* ink smearing analogy, and more the comet tail analogy
		* (in ink smearing the tail points forward, and in the
		* comet analogy the tail points backwards).
	  */
	class flow : public shader_primitive {
	
		public:
			
			/** Constructor
			  *	\param func - the vector-valued function to render
			  */
			flow(const string& f) : shader_primitive(), func(f) {
				gen_shader();
			};
			
			/** Display-list generator
			  * \param scr - the screen specs of the plot
			  * 
			  * This function generates the geometry that the geometry
			  * shader expects (a set of seed points). They are
			  * uniformly spaced on a grid.
			  */
			void dl_gen(const screen& scr);
		
		private:
			
			/** Shader generator
			  *
			  * Generates the shader - aggregates source code,
			  * compiles, links, and stores the handle in p.
			  */
			void gen_shader();
			
			/** Vertex shader source
				* 
				* Aggregates the source for the vertex shader, which
				* is just a pass-through shader. In GLSL it is an
				* error to specify a geometry shader without a vertex
				* shader, and so a pass-through shader is all that's
				* required here.
			  */
			string get_vert_shader();
			
			/** Geometry shader source
			  *
			  * Aggregates the source for the geometry shader, which
			  * is a mapping of the vector field onto a set of 
			  * streamlines.
			  */
			string get_geom_shader();
		
			// This is the function it's meant to plot.
			string func;
	
	};
	
}

#endif
