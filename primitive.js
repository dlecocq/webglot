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
	
	this.checkFramebuffer = function() {
		var gl = this.gl;
		var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

		if (status == gl.FRAMEBUFFER_COMPLETE) {
			//gl.console.log("Framebuffer complete");
		} else if (status == gl.FRAMEBUFFER_UNSUPPORTED) {
			gl.console.log("Framebuffer unsupported");
		} else if (status == gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT) {
			gl.console.log("Incomplete attachment");
		} else if (status == gl.FRAMEBUFFER_INCOMPLETE_DRAW_BUFFER) {
			gl.console.log("Incomplete draw buffer");
		} else if (status == gl.FRAMEBUFFER_INCOMPLETE_READ_BUFFER) {
			gl.console.log("Incomplete read buffer");
		} else if (status == gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE) {
			gl.console.log("Incomplete multisample");
		} else if (status == gl.FRAMEBUFFER_UNDEFINED) {
			gl.console.log("Framebuffer undefined");
		} else if (status == gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT) {
			gl.console.log("Incomplete missing attachment");
		} else {
			gl.console.log("Uncertain failure.");
		}
		
		return status;
	}
	
}