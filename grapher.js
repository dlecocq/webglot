// This class will encapsulate the grapher
function grapher() {

	this.scr = new screen();
	this.axes    = null;
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
		var canvas = document.getElementById("glot");
	
		/* It seems there's not a lot of uniformly-accepted strings for
		 * fetching the context, and so we will try severl likely ones,
		 * and bail out when we find one.
		 */
		var strings = ["experimental-webgl", "moz-webgl", "webkit-3d", "webgl"];
		
		for (var i = 0; i < strings.length; ++i) {
			try {
				if (!this.gl) {
					this.gl = canvas.getContext(strings[i]);
				} else {
					break;
				}
			} catch (e) { }
		}
	
		return this.gl;
	}
	
	/* Where sx and sy are the screen x and y coordinates, this returns
	 * a point corresponding to world space at those screen coordinates.
	 */
	this.coordinates = function(sx, sy) {
		var point = new Array();
		point["x"] = this.scr.minx + (this.scr.maxx - this.scr.minx) * (sx / this.scr.width);
		point["y"] = this.scr.maxy + (this.scr.maxy + this.scr.miny) * (sy / this.scr.height);
		return point;
	}
	
	/* The mouse-click handler
	 */
	this.mousedown = function(x, y) {
		this.start = this.coordinates(x, y);
		this.moving = true;
	}
	
	/* And the mouse-up handler
	 */
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
	
	/* The mouse-movement handler
	 */
	this.mousemove = function(x, y) {
		if (this.moving) {
			var end = this.coordinates(x, y);
		
			var dx = this.start["x"] - end["x"];
			var dy = this.start["y"] - end["y"];
		
			if (dx != 0 || dy != 0) {
				this.gl.projectionMatrix = new CanvasMatrix4();
				this.gl.projectionMatrix.ortho(this.scr.minx + dx, this.scr.maxx + dx, this.scr.miny + dy, this.scr.maxy + dy, -10, 0);
			}
		}
	}
	
	/* The keyboard handler
	 */
	this.keyboard = function(key) {
		this.gl.console.log("Key (" + key + ") pressed.");
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
		// First things first, get the WebGL rendering context.
		this.gl = this.getContext();
		
		var canvas = document.getElementById("glot");
		// This was included in the webkit examples, but my JavaScript
		// is weak, and I'm not quite sure what exactly this means.
		// Add a console
		this.gl.console = ("console" in window) ? window.console : { log: function() { } };
		
		// This is for easier callback handling
		canvas.glot = this;
		document.glot = this;
		
		/* Register various callback handlers */
		var f = function(event) { this.glot.mousedown(event.clientX, event.clientY) };
		canvas.onmousedown = f;
		
		f = function(event) { this.glot.mouseup(event.clientX, event.clientY) };
		document.onmouseup = f;
		
		f = function(event) { this.glot.mousemove(event.clientX, event.clientY) };
		document.onmousemove = f;
		
		f = function(event) { this.getElementById("glot").glot.keyboard(Number(event.keyCode)) };
		document.onkeydown = f;

		if (!this.gl) {
			alert("Can't find a WebGL context; is it enabled?");
			return null;
		}

		/* There is a slight, but unititive syntactic change between OpenGL
		 * and WebGL.	 glEnable becomes gl.enable, uncapitalizig the first
		 * character of the function call, and "gl." referes to the context
		 * provided by getContext()
		 */
		this.gl.enable(this.gl.LINE_SMOOTH);
		this.gl.enable(this.gl.POINT_SMOOTH);
		this.gl.enable(this.gl.BLEND);
		this.gl.enable(this.gl.VERTEX_ARRAY);
		this.gl.enable(this.gl.DEPTH_TEST);
	
		// Other smoothness and blending options
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
		this.gl.hint(this.gl.LINE_SMOOTH_HINT, this.gl.DONT_CARE);
	
		// Set the line width and point size
		this.gl.lineWidth(1.5);
		
		/* WebGL doesn't support this, it seems.  OpenGL ES 2.0 elliminated
		 * it to obviate the need for dedicated hardware for this task,
		 * which is a luxury in some sense.
		 *
		 * gl.pointSize(7);
		 */
	
		// Default color is white
		this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
	
		/* 
		 * WARNING! Some primitives depend on screen having the properly-
		 * filled values in screen for determination of vertex positions.
		 * Thus, it is CRITICAL that this be dynamically queried at run-
		 * time so that this data can be accurate.
		 */
		this.scr.width = this.scr.height = 500;

		this.framerate = new stopwatch();
		this.framerate.start();
		this.framecount = 0;

		this.wall = new stopwatch();
		this.wall.start();

		// Determine the axes and grid
		this.axes = new axes(this.gl, this.scr);
		//this.grid_dl = this.grid_dl_gen();
	
		// In the future, this ought to return some encoded value of success or failure.
		return 0;
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
		this.scr.recalc();
		
		var gl = this.gl;
		
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
		
		// Draw axes and grid
		/*
		program = this.axes.program;
		gl.useProgram(program);
		this.scr.set_uniforms(gl, program);
		this.axes.draw(this.scr);
		//*/
		
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
		this.axes.refresh(this.scr);
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
	
	this.get = function(parameter) {
		return this.parameters[parameter];
	}
	
	this.run = function() {
		window.glot = this;
		window.setInterval(function() { this.glot.display(); }, 10);
	}
	
	this.initialize();
}