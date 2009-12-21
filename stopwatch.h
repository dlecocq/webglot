#ifndef STOPWATCH_H
#define STOPWATCH_H

#include <sys/time.h>
#include <time.h>

/** \brief stopwatch : encapsulates timing routines
  *
	* This class encapsulates the system's timing functions.
	* I've found that Mac and Linux use very different
	* versions of time.h, and with different clock resolutions.
	* Rather than deal with it in the silly C-style (this 
	* is C++ after all), I created a simple stopwatch class.
  */
class stopwatch {

	public:
	
		/** \brief Constructor
		  */
		stopwatch() : s() {};
	
		/** \brief Start the stopwatch
		  *
		  * Start the timing of the stopwatch, just records the
		  * current WALL TIME.  This does not measure anything
		  * but the wall time.  Not system time, not clock cycles
		  * just the wall time.
		  */
		void start();
		
		/** \brief Get the current time of the stopwatch
		  *
		  * This returns the stopwatch's current time without
		  * stopping it.  Returns the time in seconds as a double
		  */
		double time();
	
		/** \brief Stop the stopwatch, get the time
			*
			* This returns the stopwatch's current time and
			* does stop it.  Returns the time in seconds as a double
		  */
		double stop();

	private:
		timeval s, tmp;
		double t;

};

#endif