#ifndef FUNCTION_H
#define FUNCTION_H

using namespace std;

namespace glot {

	class function {

		public:
			
			/** A double-to-double mapping
			  * \param x - for a given x, return another double
			  *
			  * Just a mapping of R1 onto R1, using any C++
			  * code meeting that definition
			  */
			typedef double (*double_function)(double x);
			
			/** A 2D to 1D mapping function
			  * \param x - the x parameter 
				* \param y - the y parameter
				*/
			typedef double (*double_2d_1d_function)(double x, double y);
	
			/** Constructor
			  * \param f - a function
			  */
			function(double_function f) : func(f) {};
			
			function(double_2d_1d_function f) : f2(f) {};
	
			/** Evaluate the function at a point
			  * \param x - the x value at which to evaluate
			  */
			double eval(double x) const {
				return func(x);
			};
			
			double eval(double x, double y) const {
				return f2(x, y);
			};
	
		private:
	
			double_function func;
			double_2d_1d_function f2;

	};
	
}

#endif
