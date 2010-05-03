// This class encapsulates curves
function grid(gl, scr) {
	
	this.gl = gl;
	
	this.vertexVBO  = null;
	this.indexVBO   = null;
	this.count      = 0;
	this.color      = [0, 0, 0, 0.3];

	this.initialize = function(scr) {
		this.refresh(scr);
		this.gen_program();
	}
	
	this.refresh = function(scr) {
		this.gen_vbo(scr);
	}

	this.gen_vbo = function(scr) {
		var vertices = [ ];
		var indices  = [ ];
		
		this.count = 0;
		
		for (var i = Math.floor(scr.minx); i < Math.ceil(scr.maxx); ++i) {
			vertices.push(i);
			vertices.push(scr.miny);
			vertices.push(-1);
			indices.push(this.count);
			++this.count;
			vertices.push(i);
			vertices.push(scr.maxy);
			vertices.push(-1);
			indices.push(this.count);
			++this.count;
		}
		
		for (var i = Math.floor(scr.miny); i < Math.ceil(scr.maxy); ++i) {
			vertices.push(scr.minx);
			vertices.push(i);
			vertices.push(-1);
			indices.push(this.count);
			++this.count;
			vertices.push(scr.maxx);
			vertices.push(i);
			vertices.push(-1);
			indices.push(this.count);
			++this.count;
		}

		this.vertexVBO = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexVBO);
		gl.bufferData(gl.ARRAY_BUFFER, new WebGLFloatArray(vertices), gl.STATIC_DRAW);
		
		this.count = indices.length;
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
		
		this.gl.drawElements(this.gl.LINES, this.count, this.gl.UNSIGNED_SHORT, 0);
		
		this.gl.disableVertexAttribArray(0);
	}
	
	this.gen_program = function() {
		var vertex_source = this.read("shaders/passthru.vert");
		var frag_source		= this.read("shaders/passthru.frag");
		
		this.program = this.compile_program(vertex_source, frag_source);		
	}
	
	this.initialize(scr);
}

grid.prototype = new primitive();