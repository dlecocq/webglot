// This class will encapsulate the grapher
function scalar_field(context) {
	
	this.gl = context;
	
	this.vertexVBO	= null;
	this.textureVBO = null;
	this.indexVBO		= null;

	this.initialize = function(scr) {
		this.gen_vbo(scr);
		this.gen_program();
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
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(vertices), this.gl.STATIC_DRAW);

		this.textureVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureVBO);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(texture), this.gl.STATIC_DRAW);
		
		this.indexVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new WebGLUnsignedShortArray(indices), this.gl.STATIC_DRAW);
	}
	
	this.draw = function() {
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
		var frag_source		= this.read("shaders/scalar.frag");
		
		var vertex_shader = this.gl.createShader(this.gl.VERTEX_SHADER);
		var frag_shader		= this.gl.createShader(this.gl.FRAGMENT_SHADER);
		
		this.gl.shaderSource(vertex_shader, vertex_source);
		this.gl.shaderSource(	 frag_shader, frag_source);

		this.gl.compileShader(vertex_shader);
		this.gl.compileShader(frag_shader);
		
		/* You can handle the compile status with the code provided by 
		 * Khronos or every WebGL demo anywhere.
		 */
		/*
			// Check the compile status
			var compiled = ctx.getShaderParameter(shader, ctx.COMPILE_STATUS);
			if (!compiled) {
					// Something went wrong during compilation; get the error
					var error = ctx.getShaderInfoLog(shader);
					alert(error);
					ctx.deleteShader(shader);
					return null;
			}
		*/

		// Create the program object
		this.program = this.gl.createProgram();

		// Attach our two shaders to the program
		this.gl.attachShader(this.program, vertex_shader);
		this.gl.attachShader(this.program, frag_shader);

		// Link the program
		this.gl.linkProgram(this.program);

		/* You can check link status with this code, found at Khronos
		 * and every WebGL demo everywhere
		 */
		/*
		// Check the link status
		var linked = gl.getProgramParameter(gl.program, gl.LINK_STATUS);
		if (!linked) {
				// something went wrong with the link
				var error = gl.getProgramInfoLog (gl.program);
				gl.console.log("Error in program linking:"+error);

				gl.deleteProgram(gl.program);
				gl.deleteProgram(fragmentShader);
				gl.deleteProgram(vertexShader);

			 return null;
		}
		*/
		
		this.gl.useProgram(this.program);
	}
}

scalar_field.prototype = new primitive();