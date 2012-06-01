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

// This class encapsulates parametric curves
function nurbs(knots, cps, degree, color, options) {
	
	this.gl           = null;
	this.knots        = knots;
	this.knotsTexture = null;
	this.cps          = cps;
	this.cpsTexture   = null;
	this.degree       = degree;
	
	this.vertexVBO	= null;
	this.indexVBO	= null;
	this.lVBO       = null;
	this.count	 	= 1000;
	this.parameters = null;
	this.color      = color || [0, 0, 0, 1];
	this.options    = options || (CARTESIAN | X_LIN | Y_LIN);

	this.initialize = function(gl, scr, parameters) {
		this.gl = gl;
		this.parameters = parameters;
		this.gen_vbo(scr);
		this.refresh();
		this.gen_program();
	}
	
	this.refresh = function(scr) {
		
		knots = this.knots;
		f = function(pixels) {
			for (var i = 0; i < knots.length; i += 1) {
				
				pixels[i * 4] = knots[i];
			}
			return pixels;
		}
		this.knotsTexture = ftexture(this.gl, this.knots.length, 1, f);
		
		cps = this.cps;
		f = function(pixels) {
			for (var i = 0; i < cps.length; i += 1) {
				tmp = cps[i];
				for (var j = 0; j < tmp.length; j += 1) {
					pixels[i * 4 + j] = tmp[j];
				}
			}
			return pixels;
		}
		this.cpsTexture = ftexture(this.gl, this.cps.length, 1, f);
	}

	this.gen_vbo = function(scr) {
		var vertices = [];
		var indices	 = [];
		var ls       = [];
		var points   = [];
		
		// Increment l, searching for interval u_{l} to u_{l+1}
		var l = 0;
		
		var a = 0;
		var dx = 1.0 / this.count;
		
		for (var i = 0; i < this.count; ++i) {
			vertices.push(a);
			indices.push(i);
			while (this.knots[l + 1] <= a) {
				l = l + 1;
			}
			
			ls.push(l);
			
			a += dx;
		}

		/* Add this soon */
		if (this.vertexVBO) {
			//this.gl.console.log("deleting");
			//this.gl.deleteBuffer(this.vertexVBO);
		}
		
		this.vertexVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
		
		this.lVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.lVBO);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(ls), this.gl.STATIC_DRAW);
		
		this.indexVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		// I think this ought to be changed to STATIC_DRAW
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
	}
	
	this.draw = function(scr) {
		this.setUniforms(scr);

		// Set a few uniforms
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "knotsTexture"), 0);
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "knotCount"   ), this.knots.length);
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "cpsTexture"  ), 1);
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "cpCount"     ), this.cps.length);
		
		// Enable attribute array buffers,
		this.gl.enableVertexAttribArray(0);
		this.gl.enableVertexAttribArray(1);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
		this.gl.vertexAttribPointer(0, 1, this.gl.FLOAT, this.gl.FALSE, 0, 0);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.lVBO);
		this.gl.vertexAttribPointer(1, 1, this.gl.FLOAT, this.gl.FALSE, 0, 0);
		
		// Then element array buffer
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		// Enable and bind pertinent textures
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.knotsTexture);
		this.gl.activeTexture(this.gl.TEXTURE1);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.cpsTexture);
		this.gl.drawElements(this.gl.LINE_STRIP, this.count, this.gl.UNSIGNED_SHORT, 0);
		
		this.gl.disableVertexAttribArray(0);
		this.gl.disableVertexAttribArray(1);
	}
	
	this.gen_program = function() {
		var vertex_source = this.read("shaders/nurbs.vert").replace("USER_FUNCTION", "s").replace(/DEGREE/g, this.degree);
		var frag_source	  = this.read("shaders/nurbs.frag");
		
		this.program = this.compile_program(vertex_source, frag_source, { "position": 0, "l": 1 });
	}
}

nurbs.prototype = new primitive();