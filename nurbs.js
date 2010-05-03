// This class encapsulates parametric curves
function nurbs(knots, cps, degree, color, options) {
	
	this.gl           = null;
	this.knots        = knots;
	this.knotsTexture = null;
	this.cps          = cps;
	this.cpsTexture   = null;
	this.degree       = degree;
	
	this.vertexVBO	= null;
	this.indexVBO	= null;
	this.lVBO       = null;
	this.count	 	= 1000;
	this.parameters = null;
	this.color      = color || [0, 0, 0, 1];
	this.options    = options || (CARTESIAN | X_LIN | Y_LIN);

	this.initialize = function(gl, scr, parameters) {
		this.gl = gl;
		this.parameters = parameters;
		this.refresh();
		this.gen_program();
	}
	
	this.refresh = function(scr) {
		this.gen_vbo(scr);
		
		knots = this.knots;
		f = function(pixels) {
			for (var i = 0; i < knots.length; i += 1) {
				
				pixels[i * 4] = knots[i];
			}
			return pixels;
		}
		this.knotsTexture = ftexture(this.gl, this.knots.length, 1, f);
		
		cps = this.cps;
		f = function(pixels) {
			for (var i = 0; i < cps.length; i += 1) {
				tmp = cps[i];
				for (var j = 0; j < tmp.length; j += 1) {
					pixels[i * 4 + j] = tmp[j];
				}
			}
			return pixels;
		}
		this.cpsTexture = ftexture(this.gl, this.cps.length, 1, f);
	}

	this.gen_vbo = function(scr) {
		var vertices = [];
		var indices	 = [];
		var ls       = [];
		var points   = [];
		
		// Increment l, searching for interval u_{l} to u_{l+1}
		var l = 0;
		
		var a = 0;
		var dx = 1.0 / this.count;
		
		for (var i = 0; i < this.count; ++i) {
			vertices.push(a);
			indices.push(i);
			while (this.knots[l + 1] < a) {
				l = l + 1;
			}
			
			ls.push(l);
			
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
		
		this.lVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.lVBO);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new WebGLFloatArray(ls), this.gl.STATIC_DRAW);
		
		this.indexVBO = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		// I think this ought to be changed to STATIC_DRAW
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new WebGLUnsignedShortArray(indices), this.gl.STATIC_DRAW);
	}
	
	this.draw = function(scr) {
		this.setUniforms(scr);

		// Set a few uniforms
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "knotsTexture"), 0);
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "knotCount"   ), this.knots.length);
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "cpsTexture"  ), 1);
		this.gl.uniform1i(this.gl.getUniformLocation(this.program, "cpCount"     ), this.cps.length);
		
		// Enable attribute array buffers,
		this.gl.enableVertexAttribArray(0);
		this.gl.enableVertexAttribArray(1);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexVBO);
		this.gl.vertexAttribPointer(0, 1, this.gl.FLOAT, this.gl.FALSE, 0, 0);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.lVBO);
		this.gl.vertexAttribPointer(1, 1, this.gl.FLOAT, this.gl.FALSE, 0, 0);
		
		// Then element array buffer
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
		
		// Enable and bind pertinent textures
		this.gl.enable(this.gl.TEXTURE_2D);
		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.knotsTexture);
		this.gl.activeTexture(this.gl.TEXTURE1);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.cpsTexture);
		this.gl.drawElements(this.gl.LINE_STRIP, this.count, this.gl.UNSIGNED_SHORT, 0);
		
		this.gl.disableVertexAttribArray(0);
		this.gl.disableVertexAttribArray(1);
	}
	
	this.gen_program = function() {
		var vertex_source = this.read("shaders/nurbs.vert").replace("USER_FUNCTION", "s").replace(/DEGREE/g, this.degree);
		var frag_source	  = this.read("shaders/nurbs.frag");
		
		this.program = this.compile_program(vertex_source, frag_source);		
	}
}

nurbs.prototype = new primitive();