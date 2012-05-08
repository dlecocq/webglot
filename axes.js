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

// This class encapsulates curves
function axes(gl, scr) {
	
	this.gl = gl;
	
	this.vertexVBO  = null;
	this.indexVBO   = null;
	this.color      = [0, 0, 0, 1];

	this.initialize = function(scr) {
		this.refresh(scr);
		this.gen_program();
	}
	
	this.refresh = function(scr) {
		this.gen_vbo(scr);
	}

	this.gen_vbo = function(scr) {
		var vertices = [ scr.minx, 0, -1,
		                 scr.maxx, 0, -1,
		                 0, scr.miny, -1,
		                 0, scr.maxy, -1];
		var indices  = [0, 1, 2, 3];

		this.vertexVBO = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexVBO);
		gl.bufferData(gl.ARRAY_BUFFER, new WebGLFloatArray(vertices), gl.STATIC_DRAW);
		
		this.indexVBO = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new WebGLUnsignedShortArray(indices), gl.STATIC_DRAW);
	}
	
	this.draw = function(scr) {
		this.setUniforms(scr);
		
		this.gl.enableVertexAttribArray(0);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
		this.gl.vertexAttribPointer(0, 3, this.gl.FLOAT, this.gl.FALSE, 0, 0);
		
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		this.gl.drawElements(this.gl.LINES, 4, this.gl.UNSIGNED_SHORT, 0);
		
		this.gl.disableVertexAttribArray(0);
	}
	
	this.gen_program = function() {
		var vertex_source = this.read("shaders/passthru.vert");
		var frag_source		= this.read("shaders/passthru.frag");
		
		this.program = this.compile_program(vertex_source, frag_source);		
	}
	
	this.initialize(scr);
}

axes.prototype = new primitive();