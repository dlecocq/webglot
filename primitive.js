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