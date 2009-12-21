#ifndef SHADER_PRIMITIVE_H
#define SHADER_PRIMITIVE_H

#include <iostream>
#include <fstream>
#include <string>

#include <GL/glew.h>

#include "primitive.h"
#include "screen.h"
#include "color.h"

using namespace std;

namespace glot {
	
	/** \brief shader_primitive: the parent class of all
	  * primitives that use their own shaders
	  *
		* This class is the parent of all the primitives that
		* get drawn to the screen but use their own shaders.
		* It helps out by providing a few helpful functions 
		* for compiling shader programs and reading files and
		* so forth.
		*
		* \sa shader_primitive
	  */
	class shader_primitive : public primitive {
	
		public:
			
			/** Default constructor
			  */
			shader_primitive(short int layout_opt = X_LIN | Y_LIN | CARTESIAN ) : primitive(layout_opt), f(0), g(0), v(0) {};
			
			/** Constructor
			  * \param col - the color of the primitive
			  */
			shader_primitive(const color& col, short int layout_opt = X_LIN | Y_LIN | CARTESIAN ) : primitive(col, layout_opt) {};
			
			/** Destructor
				* 
				* Virtual classes need virtual destructors
			  */
			virtual ~shader_primitive() {
				cout << "Deleting program " << p << endl;
				glDeleteProgram(p);
			};
			
			/** Program linking errors
			  * \param obj - the program to talk about
			  *
			  * This function prints out information about the linking
			  * stage of the GLSL shader program generation. GLSL
			  * prefers to fail silently, but provides ways to query
			  * back on the status of the linking of the shader program
			  * and this provides a way to check on that status in a
			  * human-readable format.
			  *
			  * I found this helpful function at:
			  * http://www.lighthouse3d.com/opengl/glsl/index.php?oglinfo
			  */
			void printProgramInfoLog(GLuint obj);
			
			/** Shader compiling errors
			  * \param obj - the shader to talk about
			  *
			  * This function prints out information about the compiling
			  * of the GLSL shader.  GLSL fails silently, but has a way
			  * to the status of the compilation of a shader and this
			  * prints out that information.
				*
			  * I found this helpful function at:
			  * http://www.lighthouse3d.com/opengl/glsl/index.php?oglinfo
			  */
			void printShaderInfoLog(GLuint obj);
			
			/** Read in a file
			  * \param filename - the name of the file to read
			  * 
			  * Reads a file, returns a string with the contents of that
			  * file.  Meant to facilitate reading in the shader source,
			  * which is usually stored in a file.
			  */
			string read_file(const char * filename);
		
		protected:
			
			/** Shader source handles
			  *
			  * I'm not entirely sure if it's necessary to store these
			  * handles beyond the compiling and then linking the shader
			  * program, but these are for that purpose.
			  */
			GLhandleARB f;
			GLhandleARB g;
			GLhandleARB v;
		
		private:
	
	};

}

#endif
