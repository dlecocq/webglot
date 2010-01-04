function primitive(context) {
	
	this.BASE		 = "file:///Users/dlecocq/TTRG/webGLot/src/";
	this.program = null;
	
	this.read = function(filename) {
		var request = new XMLHttpRequest();
		var url = this.BASE + filename;
		
		request.open("GET", url, false);
		request.send();
		return request.responseText;
	}
	
	this.compile_program = function(vertex_source, frag_source) {
		var vertex_shader = this.gl.createShader(this.gl.VERTEX_SHADER);
		var frag_shader		= this.gl.createShader(this.gl.FRAGMENT_SHADER);
		
		this.gl.shaderSource(vertex_shader, vertex_source);
		this.gl.shaderSource(	 frag_shader, frag_source);

		this.gl.compileShader(vertex_shader);
		this.gl.compileShader(frag_shader);
		
		/* You can handle the compile status with the code provided by 
		 * Khronos or every WebGL demo anywhere.
		 */
		// Check the compile status
		var compiled = this.gl.getShaderParameter(vertex_shader, this.gl.COMPILE_STATUS);
		if (!compiled) {
				// Something went wrong during compilation; get the error
				var error = this.gl.getShaderInfoLog(vertex_shader);
				this.gl.console.log("Vertex shader error: " + error);
				this.gl.deleteShader(vertex_shader);
				return null;
		}
		
		compiled = this.gl.getShaderParameter(frag_shader, this.gl.COMPILE_STATUS);
		if (!compiled) {
				// Something went wrong during compilation; get the error
				var error = this.gl.getShaderInfoLog(frag_shader);
				this.gl.console.log("Fragment shader error: " + error);
				this.gl.deleteShader(frag_shader);
				return null;
		}

		// Create the program object
		var program = this.gl.createProgram();

		// Attach our two shaders to the program
		this.gl.attachShader(program, vertex_shader);
		this.gl.attachShader(program, frag_shader);

		// Link the program
		this.gl.linkProgram(program);

		/* You can check link status with this code, found at Khronos
		 * and every WebGL demo everywhere
		 */
		// Check the link status
		var linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
		if (!linked) {
				// something went wrong with the link
				var error = this.gl.getProgramInfoLog(program);
				this.gl.console.log("Error in program linking: " + error);

				this.gl.deleteProgram(program);
				this.gl.deleteProgram(frag_shader);
				this.gl.deleteProgram(vertex_shader);

			 return null;
		}
		
		return program;
	}
	
}