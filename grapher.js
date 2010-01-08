// This class will encapsulate the grapher
function grapher() {

	this.scr = new screen();
	this.axes_dl = null;
	this.grid_dl = null;
	this.gl			 = null;
	this.wall		 = null;
	
	this.start   = null;
	this.moving  = false;
	
	// A framerate timer
	this.framerate	= null;
	this.framecount = 0;
	
	this.userClickFunction    = null;
	this.userKeyboardFunction = null;
	
	this.primitives = new Array();
	this.parameters = new Array();

	this.getContext = function() {
		// It would seem that all this context stuff is handled in this,
		// so no need to fuss with things like getting glutContext, etc.
		// At least, that's my understanding at this point.
		var canvas = document.getElementById("glot");
	
		var gl = null;
	
		/* It seems there's not a lot of uniformly-accepted strings for
		 * fetching the context, and so we will try severl likely ones,
		 * and bail out when we find one.
		 */
		var strings = ["experimental-webgl", "moz-webgl", "webkit-3d", "webgl"];
		
		for (var i = 0; i < strings.length; ++i) {
			try {
				if (!gl) {
					gl = canvas.getContext(strings[i]);
				} else {
					break;
				}
			} catch (e) { }
		}
	
		return gl;
	}
	
	/* sx and sy are the screen x and y coordinates.
	 */
	this.coordinates = function(sx, sy) {
		var point = new Array();
		point["x"] = this.scr.minx + (this.scr.maxx - this.scr.minx) * (sx / this.scr.width);
		point["y"] = this.scr.maxy + (this.scr.maxy - this.scr.miny) * (sy / this.scr.height);
		return point;
	}
	
	this.mousedown = function(x, y) {
		this.start = this.coordinates(x, y);
		this.moving = true;
	}
	
	this.mouseup = function(x, y) {
		try {
			var end = this.coordinates(x, y);
		
			var dx = this.start["x"] - end["x"];
			var dy = this.start["y"] - end["y"];
		
			if (dx != 0 || dy != 0) {
				this.scr.minx -= dx;
				this.scr.maxx -= dx;
				this.scr.miny -= dy;
				this.scr.maxy -= dy;
				this.refresh_dls();
			}
			this.moving = false;
			
			if (this.userClickFunction) {
				this.userClickFunction(end.x, end.y);
			}
			
		} catch (e) {}
	}
	
	this.mousemove = function(x, y) {
		if (this.moving) {
			var end = this.coordinates(x, y);
		
			var dx = this.start["x"] - end["x"];
			var dy = this.start["y"] - end["y"];
		
			if (dx != 0 || dy != 0) {
				var avgx = (this.scr.minx + this.scr.maxx);
				var avgy = (this.scr.miny + this.scr.maxy);
				this.gl.projectionMatrix = new CanvasMatrix4();
				this.gl.projectionMatrix.ortho(this.scr.minx - avgx + dx, this.scr.maxx - avgx + dx, this.scr.miny - avgy + dy, this.scr.maxy - avgy + dy, -10, 0);
			}
		}
	}
	
	this.keyboard = function(key) {
		if (key == 189) {
			this.zoom(1.15);
		} else if (key == 187) {
			this.zoom(1.0 / 1.15);
		}
	}
	
	this.zoom = function(scale) {
		
		var diff = (this.scr.maxx - this.scr.minx) * scale / 2.0;
		var midx = (this.scr.maxx + this.scr.minx) / 2.0;
		this.scr.minx = midx - diff;
		this.scr.maxx = midx + diff;
		
		diff = (this.scr.maxy - this.scr.miny) * scale / 2.0;
		midy = (this.scr.maxy + this.scr.miny) / 2.0;
		this.scr.miny = midy - diff;
		this.scr.maxy = midy + diff;
		
		midx *= 2;
		midy *= 2;
		
		/*
		this.gl.projectionMatrix = new CanvasMatrix4();
		this.gl.projectionMatrix.ortho(this.scr.minx - midx, this.scr.maxx - midx, this.scr.miny - midy, this.scr.maxy - midy, -10, 0);
		*/
		
		this.scr.recalc();
		
		if (scale > 1) {
			this.refresh_dls();
		}
	}
	
	this.setClickFunction = function(myfunction) {
		this.userClickFunction = myfunction;
	}

	this.initialize = function() {
	
		/* This is some initialization that the OpenGL / GLUT version of
		 * openGLot did programatically after creating the context. But,
		 * in WebGL, they are passed in as parameters into the initial-
		 * ization phase, but I'm not yet sure as to the syntax.	Add this
		 * in for later versions.	 Provisionally disabled.
		 */
		/*
		// Set the color mode (double with alpha)
		glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGBA);
		*/
		
		var canvas = document.getElementById("glot");
		canvas.glot = this;
		document.glot = this;
		
		var f = function(event) { this.glot.mousedown(event.clientX, event.clientY) };
		canvas.onmousedown = f;
		
		f = function(event) { this.glot.mouseup(event.clientX, event.clientY) };
		document.onmouseup = f;
		
		f = function(event) { this.glot.mousemove(event.clientX, event.clientY) };
		document.onmousemove = f;
		
		f = function(event) { this.getElementById("glot").glot.keyboard(Number(event.keyCode)) };
		document.onkeydown = f;
	
		var gl = this.getContext();
		this.gl = gl;

		if (!gl) {
			alert("Can't find a WebGL context; is it enabled?");
			return null;
		}

		/* There is a slight, but unititive syntactic change between OpenGL
		 * and WebGL.	 glEnable becomes gl.enable, uncapitalizig the first
		 * character of the function call, and "gl." referes to the context
		 * provided by getContext()
		 */
		gl.enable(gl.LINE_SMOOTH);
		gl.enable(gl.POINT_SMOOTH);
		gl.enable(gl.BLEND);
		gl.enable(gl.VERTEX_ARRAY);
		gl.enable(gl.DEPTH_TEST);
	
		// Other smoothness and blending options
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.hint(gl.LINE_SMOOTH_HINT, gl.DONT_CARE);
	
		// Set the line width and point size
		gl.lineWidth(1.5);
		
		/* WebGL doesn't support this, it seems.  OpenGL ES 2.0 elliminated
		 * it to obviate the need for dedicated hardware for this task,
		 * which is a luxury in some sense.
		 *
		 * gl.pointSize(7);
		 */
	
		// Default color is white
		gl.clearColor(1.0, 1.0, 1.0, 1.0);

		// This was included in the webkit examples, but my JavaScript
		// is weak, and I'm not quite sure what exactly this means.
		// Add a console
		var canvas = document.getElementById("glot");
		gl.console = ("console" in window) ? window.console : { log: function() { } };
	
		/* The Provisional WebGL spec has something to say on maniuplating
		 * the view size programatically.	 It's tied to the canvas element
		 * size, and certain conditions and post-conditions must be satis-
		 * fied, so proceed with caution.
		 *
		 * WARNING! Some primitives depend on screen having the properly-
		 * filled values in screen for determination of vertex positions.
		 * Thus, it is CRITICAL that this be dynamically queried at run-
		 * time so that this data can be accurate.
		 */
		this.scr.width = this.scr.height = 500;

		/* Again, it would seem that all the initialization heavy lifting
		 * is handled by the WebGL canvas initialization, so I don't think
		 * this line is required.
		 */
		// Initialize OpenGL
		// init_open_gl();
	
		/* The callback registration for WebGL is either not intuitive,
		 * undocumented, or unavailable to me.	As such, this is provision-
		 * ally removed from the WebGL implementation.
		 */
		// Register callback functions with GLUT
		/*
		glutDisplayFunc(display);
		*/

		this.framerate = new stopwatch();
		this.framerate.start();

		this.wall = new stopwatch();
		this.wall.start();

		// Determine the axes and grid
		//this.axes_dl = this.axes_dl_gen();
		//this.grid_dl = this.grid_dl_gen();
	
		this.framecount = 0;
	
		// Consult JavaScript timing documentation
		//wall.start();
	
		this.gl = gl;
	
		// In the future, this ought to return some encoded value of success or failure.
		return 0;
	}

	this.axes_dl_gen = function() {
		if (this.axes_dl != null) {
			delete this.axes_dl;
		}
		var gl = this.getContext();
	
		var geometryData = [ ];
		var textureData = [ ];
		var indexData = [ ];

		geometryData.push(this.scr.minx);
		geometryData.push(this.scr.miny);
		textureData.push(this.scr.minx);
		textureData.push(this.scr.miny);

		geometryData.push(this.scr.minx);
		geometryData.push(this.scr.maxy);
		textureData.push(this.scr.minx);
		textureData.push(this.scr.maxy);

		geometryData.push(this.scr.maxx);
		geometryData.push(this.scr.maxy);
		textureData.push(this.scr.maxx);
		textureData.push(this.scr.maxy);

		geometryData.push(this.scr.maxx);
		geometryData.push(this.scr.miny);
		textureData.push(this.scr.maxx);
		textureData.push(this.scr.miny);

		indexData.push(0);
		indexData.push(1);
		indexData.push(2);
		indexData.push(3);
				
		var retval = { };

		retval.vertexObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, retval.vertexObject);
		gl.bufferData(gl.ARRAY_BUFFER, new WebGLFloatArray(geometryData), gl.DYNAMIC_DRAW);

		retval.textureObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, retval.textureObject);
		gl.bufferData(gl.ARRAY_BUFFER, new WebGLFloatArray(textureData), gl.DYNAMIC_DRAW);
		
		retval.numIndices = indexData.length;
		retval.indexObject = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, retval.indexObject);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new WebGLUnsignedShortArray(indexData), gl.STREAM_DRAW);
		
		return retval;
	}

	this.grid_dl_gen = function() {
		var gl = this.getContext();
		var dl = gl.genLists(1);
	
		glNewList(dl, GL_COMPILE);
	
			glColor4d(0.0, 0.0, 0.0, 0.14);
	
			glBegin(GL_LINES);
		
				// How does typecasting work in JavaScript?
				for( var i = this.scr.miny; i <= this.scr.maxy; ++i) {
					glVertex3d(this.scr.minx, i, 1);
					glVertex3d(this.scr.maxx, i, 1);
				}
	
				for( var i = this.scr.minx; i <= this.scr.maxx; ++i) {
					glVertex3d(i, this.scr.miny, 1);
					glVertex3d(i, this.scr.maxy, 1);
				}
		
			glEnd();
		
		glEndList();
	
		return dl;
	}

	this.display = function() {
		
		this.reshape();
		
		var gl = this.getContext();
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		var program				 = null;
		var mvMat_location = null;
		var prMat_location = null;
		var time_location	 = null;
		var param_loc      = null;
		
		this.scr.time = this.wall.time();

		for (var i in this.primitives) {
			//*
			program = this.primitives[i].program;
			gl.useProgram(program);
			this.scr.recalc();
			this.scr.set_uniforms(gl, program);
			//*/
			
			//*
			for (var j in this.parameters) {
				param_loc = gl.getUniformLocation(program, j);
				gl.uniform1f(param_loc, this.parameters[j]);
			}
			//*/
			
			this.primitives[i].draw(this.scr);
		}
		
		gl.flush();
		
		this.framecount = this.framecount + 1;
		if (this.framecount == 150) {
			document.getElementById("framerate").innerHTML = "Framerate: " + 150 / this.framerate.time();
			this.framecount = 0;
			this.framerate = new stopwatch();
			this.framerate.start();
		}
		
		gl.finish();
	}

	this.refresh_dls = function() {
		for (var i = 0; i < this.primitives.length; ++i) {
			this.primitives[i].refresh(this.scr);
		}
		//this.axes_dl = this.axes_dl_gen();
		//this.grid_dl = grid_dl_gen(); 
	}

	this.reshape = function() {
		var canvas = document.getElementById("glot");
		var context = this.getContext();
	
		var w = canvas.clientWidth;
		var h = canvas.clientHeight;
	
		/* If the width and height of the resized canvas are already
		 * the stored sizes, return and do nothing.
		 */
		if (w == this.scr.width && h == this.scr.height) {
			return;
		}
	
		context.viewport(0, 0, w, h);

		/** Determine the new max x and y based on the
			* current scale.	This does not shrink or expand
			* the plot - only changes what's visible.
			*/
		this.scr.maxx = this.scr.minx + (this.scr.maxx - this.scr.minx) * w / this.scr.width;
		this.scr.maxy = this.scr.miny + (this.scr.maxy - this.scr.miny) * h / this.scr.height;
		
		var xw = this.scr.maxx - this.scr.minx;
		var yh = this.scr.maxy - this.scr.miny;

		this.scr.recalc();

		// Re-calculate the draw lists if we've expanded the view
		if (w > this.scr.width || h > this.scr.height) {
			this.refresh_dls();
		}
	
		this.scr.width = w;
		this.scr.height = h;

		//glutPostRedisplay();
	}
	
	this.add = function(primitive) {
		this.primitives.push(primitive);
		primitive.initialize(this.gl, this.scr, this.parameters);
	}
	
	this.set = function(parameter, value) {
		this.parameters[parameter] = value;
	}
	
	this.run = function() {
		window.glot = this;
		window.setInterval(function() { this.glot.display(); }, 10);
	}
	
	this.initialize();
}