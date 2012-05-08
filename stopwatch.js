/* Copyright (c) 2009-2010 King Abdullah University of Science and Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/** \brief stopwatch : encapsulates timing routines
	*
	* This class encapsulates the system's timing functions.
	* I've found that Mac and Linux use very different
	* versions of time.h, and with different clock resolutions.
	* Rather than deal with it in the silly C-style (this 
	* is C++ after all), I created a simple stopwatch class.
	*/

function stopwatch() {
	
	this.s	 = null;
	this.tmp = null;
	this.t	 = 0;

	/** \brief Start the stopwatch
		*
		* Start the timing of the stopwatch, just records the
		* current WALL TIME.	This does not measure anything
		* but the wall time.	Not system time, not clock cycles
		* just the wall time.
		*/
	this.start = function() {
		this.s = new Date().getTime();
	}

	/** \brief Get the current time of the stopwatch
		*
		* This returns the stopwatch's current time without
		* stopping it.	Returns the time in seconds as a double
		*/
	this.time = function() {
		this.tmp = new Date().getTime();
		this.t = (this.tmp - this.s) / 1000;
		return this.t;
	}

	/** \brief Stop the stopwatch, get the time
		*
		* This returns the stopwatch's current time and
		* does stop it.	 Returns the time in seconds as a double
		*/
	this.stop = function() {
		this.tmp = new Date().getTime();
		this.t = (this.tmp - this.s) / 1000;
		return this.t;
	}
	
}