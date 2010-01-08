// This class encapsulates curves
function curve(string) {
	
	this.gl = null;
	this.f  = string;
	
	this.vertexVBO	= null;
	this.indexVBO		= null;
	this.count			= 1000;
	this.parameters = null;

	this.initialize = function(gl, scr, parameters) {
		this.gl = gl;
		this.parameters = parameters;
		this.refresh(scr);
		this.gen_program();
	}
	
	this.refresh = function(scr) {
		this.gen_vbo(scr);
	}

	this.gen_vbo = function(scr) {
		var vertices = [];
		var indices	 = [];
		
		var a = scr.minx;
		var dx = (scr.maxx - scr.minx) / this.count;
		
		for (var i = 0; i < this.count; ++i) {
			vertices.push(a);
			indices.push(i);
			a += dx;
		}

		/* Add this soon */
		if (this.vertexVBO) {
			//this.gl.console.log("deleting");
			//this.gl.deleteBuffer(this.vertexVBO);
		}
		
		this.vertexVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(vertices), this.gl.STATIC_DRAW);
		
		this.indexVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		// I think this ought to be changed to STATIC_DRAW
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new WebGLUnsignedShortArray(indices), this.gl.STATIC_DRAW);
	}
	
	this.draw = function(scr) {
		this.gl.enableVertexAttribArray(0);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
		this.gl.vertexAttribPointer(0, 1, this.gl.FLOAT, this.gl.FALSE, 0, 0);
		
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		this.gl.drawElements(this.gl.LINE_STRIP, this.count, this.gl.UNSIGNED_SHORT, 0);
		
		this.gl.disableVertexAttribArray(0);
	}
	
	this.gen_program = function() {
		var vertex_source = this.read("shaders/curve.vert");
		// Replace user function
		vertex_source = vertex_source.replace("USER_FUNCTION", this.f);
		
		// Add user parameters
		if (this.parameters) {
			var params = "// User parameters\n";
			for (i in this.parameters) {
				params += "uniform float " + i + ";\n";
			}
			vertex_source = vertex_source.replace("// USER_PARAMETERS", params);
		}
		
		this.gl.console.log(vertex_source);
		
		var frag_source		= this.read("shaders/curve.frag");
		
		this.program = this.compile_program(vertex_source, frag_source);		
	}
}

curve.prototype = new primitive();