// This class will encapsulate the grapher
function scalar_field(context) {
	
	this.gl = context;
	
	this.vertexVBO  = null;
	this.textureVBO = null;
	this.indexVBO   = null;

	this.initialize = function(scr, gl) {
		this.gl = gl;
		this.gen_vbo(scr);
	}

	this.gen_vbo = function(scr) {
	  var vertices = [];
		var texture  = [];

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

		indices = [0, 1, 2, 3];

		/* Add this soon */
		if (this.vertexVBO != null) {
			//this.gl.deleteBuffers()
			//void glDeleteBuffersARB(GLsizei n, const GLuint* ids)
		}
		
    this.vertexVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(vertices), this.gl.STATIC_DRAW);

    this.textureVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureVBO);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(texture), this.gl.STATIC_DRAW);
    
    this.indexVBO = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		// I think this ought to be changed to STATIC_DRAW
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new WebGLUnsignedShortArray(indices), this.gl.STREAM_DRAW);
	}
	
	this.draw = function(gl) {
		this.gl = gl;
		
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
}