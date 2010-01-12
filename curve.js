// This class encapsulates curves
function curve(string) {
	
	this.gl = null;
	this.f  = string;
	
	this.vertexVBO	= null;
	this.indexVBO		= null;
	this.count			= 1000;
	this.parameters = null;

	this.initialize = function(gl, scr, parameters, color) {
		this.gl = gl;
		this.parameters = parameters;
		this.color = color || [0, 0, 0, 1];
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

		/* Delete vertex buffers if they exist already */
		if (this.vertexVBO) {
			this.gl.deleteBuffer(this.vertexVBO);
		}
		
		if (this.indexVBO) {
			this.gl.deleteBuffer(this.indexVBO);
		}
		
		this.vertexVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(vertices), this.gl.STATIC_DRAW);
		
		this.indexVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new WebGLUnsignedShortArray(indices), this.gl.STATIC_DRAW);
	}
	
	this.draw = function(scr) {
		this.setUniforms(scr);
		
		this.gl.enableVertexAttribArray(0);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
		this.gl.vertexAttribPointer(0, 1, this.gl.FLOAT, this.gl.FALSE, 0, 0);
		
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		this.gl.drawElements(this.gl.LINE_STRIP, this.count, this.gl.UNSIGNED_SHORT, 0);
		
		this.gl.disableVertexAttribArray(0);
	}
	
	this.gen_program = function() {
		var vertex_source = this.read("shaders/curve.vert").replace("USER_FUNCTION", this.f);
		var frag_source		= this.read("shaders/curve.frag");
		
		this.program = this.compile_program(vertex_source, frag_source, this.parameters);
	}
}

curve.prototype = new primitive();