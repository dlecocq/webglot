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

function screen() {
	this.height	= this.width 	= 10;
	this.minx		= this.miny		= -5;
	this.maxx		= this.maxy		=  5;
 
	this.time									=  0;
	
	this.modelviewMatrix      = null;
	this.projectionMatrix     = null;
	
	this.s     = 1.0;
	this.dx    = 0.0;
	this.dy    = 0.0;
	
	this.recalc = function() {
		this.projectionMatrix = new CanvasMatrix4();
		this.modelviewMatrix = new CanvasMatrix4();
		
		//this.modelviewMatrix.scale(this.scale, this.scale, 1.0);
		this.modelviewMatrix.translate(-this.dx, -this.dy, 0.0);
		
		// Set the projection
		//this.projectionMatrix.ortho(this.minx + this.dx, this.maxx + this.dx, this.miny + this.dy, this.maxy + this.dy, 0, 10);
		this.projectionMatrix.ortho(this.minx, this.maxx, this.miny, this.maxy, 0, 10);
	}
	
	this.translate = function(dx, dy) {
		this.dx = dx;
		this.dy = dy;
	}
	
	this.scale = function(f) {
		this.s *= f;
	}
	
	this.set_uniforms = function(gl, program) {
		mvMat_location = gl.getUniformLocation(program, "u_modelViewMatrix");
		prMat_location = gl.getUniformLocation(program, "u_projectionMatrix");
		time_location	 = gl.getUniformLocation(program, "t");
		dx_location    = gl.getUniformLocation(program, "dx");
		dy_location    = gl.getUniformLocation(program, "dy");
		scale_location = gl.getUniformLocation(program, "scale");

		gl.uniformMatrix4fv(mvMat_location, false, this.modelviewMatrix.getAsFloat32Array());
		gl.uniformMatrix4fv(prMat_location, false, this.projectionMatrix.getAsFloat32Array());
		gl.uniform1f(time_location , this.time);
		gl.uniform1f(dx_location   , this.dx);
		gl.uniform1f(dy_location   , this.dy);
		gl.uniform1f(scale_location, this.s);
	}
	
	this.normalize = function() {
		if (this.width > this.height) {
			var ratio = (this.maxy - this.miny) / this.height;
			ratio = (ratio * (this.width - this.height)) / 2.0;
			this.maxx += ratio;
			this.minx -= ratio;
		} else if (this.height > this.width) {
			var ratio = (this.maxx - this.minx) / this.width;
			ratio = (ratio * (this.height - this.width)) / 2.0;
			this.maxy += ratio;
			this.miny -= ratio;
		}
	}
}
