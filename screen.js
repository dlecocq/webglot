function screen() {
	this.height	= this.width 	= 10;
	this.minx		= this.miny		= -5;
	this.maxx		= this.maxy		=  5;
	// Perhaps this won't be needed int the JavaScript
	// implementation.  Look into how time sampling is
	// done / available in JavaScript 
	this.time									=  0;
	
	this.modelviewMatrix      = null;
	this.projectionMatrix     = null;
	
	this.recalc = function() {
		this.projectionMatrix = new CanvasMatrix4();
		this.modelviewMatrix = new CanvasMatrix4();
		
		// Set the projection
		this.projectionMatrix.ortho(this.minx, this.maxx, this.miny, this.maxy, 0, 10);
	}
	
	this.set_uniforms = function(gl, program) {
		mvMat_location = gl.getUniformLocation(program, "u_modelViewMatrix");
		prMat_location = gl.getUniformLocation(program, "u_projectionMatrix");
		time_location	 = gl.getUniformLocation(program, "t");

		gl.uniformMatrix4fv(mvMat_location, false, this.modelviewMatrix.getAsWebGLFloatArray());
		gl.uniformMatrix4fv(prMat_location, false, this.projectionMatrix.getAsWebGLFloatArray());
		gl.uniform1f(time_location, this.time);
	}
	
	this.normalize = function() {
		if (this.width > this.height) {
			var ratio = (this.maxy - this.miny) / this.height;
			ratio = (ratio * this.width) / 2.0;
			this.maxx += ratio;
		} else if (this.height > this.width) {
			var ratio = (this.maxx - this.minx) / this.width;
			ratio = (ratio * this.height) / 2.0;
			this.maxy += ratio;
		}
	}
}
