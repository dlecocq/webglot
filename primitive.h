#ifndef PRIMITIVE_H
#define PRIMITIVE_H

#include <iostream>

#include "screen.h"
#include "color.h"

namespace glot {
	
	enum layout_opt { 
		X_LIN 		= 0,
		Y_LIN 		= 0,
		CARTESIAN = 0,
		X_LOG 		= 1,
		Y_LOG 		= 2,
		POLAR 		= 4 };
	
	/** \brief primitive: the parent class of all rendered objects
	  *
		* This class is the parent of all the primitives
		* that get drawn to the screen.
		*
		* \sa shader_primitive
	  */
	class primitive {
	
		public:
		
			/** The color of the the primitive */
			color c;
			
			/** Default constructor
			  */
			primitive(short int layout_opt = X_LIN | Y_LIN | CARTESIAN ) : c(color(0, 0, 0, 1)), p(0), layout(layout_opt) {};
			
			/** Constructor
			  * \param col - the color of the primitive 
			  *
			  * Initializes the color of the primitive and the
			  * program GLenum
			  */
			primitive(const color& col, short int layout_opt = X_LIN | Y_LIN | CARTESIAN ) : c(col), p(0), layout(layout_opt) {};
			
			/** Destructor
			  * 
			  * Virtual classes need virtual destructors
			  */
			virtual ~primitive() {};
			
			/** Display-list generator
			  * \param s - the screen specs
			  * 
			  * The screen stores the dimensions of the plot, etc.
			  * and based on that information, this function
			  * generates the geometry for the primitive.  Typically
			  * this might be stored in a display list, but that
			  * is up to the container class, grapher
			  */
			virtual void dl_gen(const screen& s) = 0;
			
			/** Shader program handle
			  * 
			  * Some primitives specify their own shader programs
			  * and the container class, grapher, will use each one's
			  * self-specified program when it's called.
			  */
			GLenum p;
		
		protected:
			
			short int layout;
		
		private:
	
	};

}

#endif
