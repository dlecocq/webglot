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

// This class will encapsulate scalar fields
function scalar_field(string, options) {
	
	this.gl   = null;
	this.f    = string;
	this.opts = options || [];
	this.parameters = null;
	
	this.vertexVBO	= null;
	this.textureVBO = null;
	this.indexVBO		= null;

	this.initialize = function(gl, scr, parameters) {
		this.parameters = parameters;
		this.gl = gl;
		this.refresh(scr);
		this.gen_program();
	}
	
	this.refresh = function(scr) {
		this.gen_vbo(scr);
	}

	this.gen_vbo = function(scr) {
		var vertices = [];
		var texture	 = [];

		vertices.push(scr.minx);
		vertices.push(scr.miny);
		 texture.push(scr.minx);
		 texture.push(scr.miny);

		vertices.push(scr.minx);
		vertices.push(scr.maxy);
		 texture.push(scr.minx);
		 texture.push(scr.maxy);

		vertices.push(scr.maxx);
		vertices.push(scr.maxy);
		 texture.push(scr.maxx);
		 texture.push(scr.maxy);

		vertices.push(scr.maxx);
		vertices.push(scr.miny);
		 texture.push(scr.maxx);
		 texture.push(scr.miny);

		indices = [0, 1, 3, 2];

		/* Add this soon */
		if (this.vertexVBO) {
			this.gl.console.log("deleting");
			this.gl.deleteBuffer(this.vertexVBO);
		}
		
		this.vertexVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

		this.textureVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureVBO);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texture), this.gl.STATIC_DRAW);
		
		this.indexVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
	}
	
	this.draw = function(scr) {
		this.setUniforms(scr);
		
		this.gl.enableVertexAttribArray(0);
		this.gl.enableVertexAttribArray(1);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
		this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, this.gl.FALSE, 0, 0);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureVBO);
		this.gl.vertexAttribPointer(1, 2, this.gl.FLOAT, this.gl.FALSE, 0, 0);
		
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		this.gl.drawElements(this.gl.TRIANGLE_STRIP, 4, this.gl.UNSIGNED_SHORT, 0);
		
		this.gl.disableVertexAttribArray(0);
		this.gl.disableVertexAttribArray(1);
	}
	
	this.gen_program = function() {
		var vertex_source = this.read("shaders/scalar.vert");
		var frag_source		= this.read("shaders/scalar.frag").replace("USER_FUNCTION", this.f);

		/*
		// Add user parameters
		if (this.parameters) {
			var params = "// User parameters\n";
			for (i in this.parameters) {
				params += "uniform float " + i + ";\n";
			}
			frag_source = frag_source.replace("// USER_PARAMETERS", params);
		}
		*/
		
		if (this.opts.indexOf("POLAR")) {
			frag_course = frag_source.replace("/* POLAR", "//");
		}
		
		this.program = this.compile_program(vertex_source, frag_source, { "position": 0, "vTexCoord": 1 });
	}
}

scalar_field.prototype = new primitive();