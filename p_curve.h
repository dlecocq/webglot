#ifndef P_CURVE_H
#define P_CURVE_H

#include <GL/glew.h>
#include <iostream>

#include "shader_primitive.h"
#include "function.h"
#include "color.h"

namespace glot {

	/** \brief p_curve: a parametric curve to plot
	  *
		* This class takes two functions that accept doubles
		* and return a double.  It then samples t in [0,1]
		* and connects the dots with straight lines
		*
		* \sa grapher
		* \sa curve
	  */
	class p_curve : public shader_primitive {
	
		public:
		
			color c;
			
			/** Constructor
			  *	\param x_f - the parametric definition of x
			  * \param y_f - the parametric definition of y
			  *	\param col - the color of the curve
			  * \param t0 - the beginning of the parameterization
			  * \param tf - the end of the parameterization
			  */
			p_curve(const string& f, const color& col, double t0 = 0, double tf = 1, short int layout_opt = X_LIN | Y_LIN | CARTESIAN) : shader_primitive(col, layout_opt), func(f), tstart(t0), tfinal(tf) {
				gen_shader();
			};
			
			void dl_gen(const screen& s);
			
			void gen_shader();
		
		protected:
		
			// This is the function it's meant to plot.
			string func;
			double tstart, tfinal;
	
	};
	
}

#endif
