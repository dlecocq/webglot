// This class will encapsulate the grapher
function grapher() {

	this.scr = new screen();
	this.axes_dl = null;
	this.grid_dl = null;
	this.gl = null;
	this.wall = null;

	this.getContext = function() {
		// It would seem that all this context stuff is handled in this,
		// so no need to fuss with things like getting glutContext, etc.
		// At least, that's my understanding at this point.
		var canvas = document.getElementById("glot");
	
		/* I hope that this works.  I'd like to be able to have a short
		 * handle for referencing the context for certain initialization
		 * things, but after that, I'd just like to have the "this.context"
		 * handle.  If WebGL behaves in the traditional OpenGL-manner,
		 * this SHOULD just be an integer, but I'm thinking now it might
		 * be ported to more of an object model.
		 */
	  //this.context = canvas.getContext("moz-webgl");\
		var gl = null;
		
		var strings = ["experimental-webgl", "moz-webgl", "webkit-3d", "webgl"];
		
		for (var i = 0; i < strings.length; ++i) {
			try {
				if (!gl) {
					gl = canvas.getContext(strings[i]);
				}
			} catch (e) { }
		}
	
		return gl;
	}

	this.initialize = function() {
	
		/* This is some initialization that the OpenGL / GLUT version of
		 * openGLot did programatically after creating the context. But,
		 * in WebGL, they are passed in as parameters into the initial-
		 * ization phase, but I'm not yet sure as to the syntax.  Add this
		 * in for later versions.  Provisionally disabled.
		 */
		/*
		// Set the color mode (double with alpha)
		glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGBA);
		// Set the window size and position
		glutInitWindowSize(scr.width, scr.height);
		glutInitWindowPosition(0, 0);
		// Title the window
		glutCreateWindow("Glot");
		*/
	
		var gl = this.getContext();

	  if (!gl) {
	    alert("Can't find a WebGL context; is it enabled?");
	    return null;
	  }

		/* There is a slight, but unititive syntactic change between OpenGL
		 * and WebGL.  glEnable becomes gl.enable, uncapitalizig the first
		 * character of the function call, and "gl." referes to the context
		 * provided by getContext()
		 */
		// Enable smoothness and blending
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
		//gl.pointSize(7);
	
		// Default color is white
		gl.clearColor(0.0, 0.0, 0.0, 0.5);

		// This was included in the webkit examples, but my JavaScript
		// is weak, and I'm not quite sure what exactly this means.
	  // Add a console
		var canvas = document.getElementById("glot");
	  gl.console = ("console" in window) ? window.console : { log: function() { } };
	
		/* The Provisional WebGL spec has something to say on maniuplating
		 * the view size programatically.  It's tied to the canvas element
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
		 * undocumented, or unavailable to me.  As such, this is provision-
		 * ally removed from the WebGL implementation.
		 */
		// Register callback functions with GLUT
		/*
		glutReshapeFunc(reshape);
		glutDisplayFunc(display);
		glutKeyboardFunc(keyboard);
		glutMouseFunc(mouse);
		glutMotionFunc(motion);
		glutIdleFunc(idle);
		*/

		this.wall = new stopwatch();
		this.wall.start();

		// Determine the axes and grid
		//this.axes_dl = this.axes_dl_gen();
		this.sf = new scalar_field(gl);
		//this.grid_dl = this.grid_dl_gen();
	
		// Shit.  Well, shit.
		/* I've not heard of / happened upon an extension wrangler for
		 * WebGL, and so I will have to figure out how to do this the 
		 * old-school, hardcore C way.  Consult Marcus for more details,
		 * though I think it is safe to assume for the time being that
		 * the required supported functions are available.
		 */
		/*
		glewInit();
	
		if (!(GLEW_ARB_vertex_shader && GLEW_ARB_fragment_shader && GLEW_EXT_geometry_shader4)) {
			printf("Not totally ready :( \n");
			exit(1);
		}
		*/
	
		this.framecount = 0;
	
		// Consult JavaScript timing documentation
		//wall.start();
	
		this.context = gl;
	
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
				for ( var i = this.scr.miny; i <= this.scr.maxy; ++i) {
					glVertex3d(this.scr.minx, i, 1);
					glVertex3d(this.scr.maxx, i, 1);
				}
	
				for ( var i = this.scr.minx; i <= this.scr.maxx; ++i) {
					glVertex3d(i, this.scr.miny, 1);
					glVertex3d(i, this.scr.maxy, 1);
				}
		
			glEnd();
		
		glEndList();
	
		return dl;
	}

	this.display = function() {
		var gl = this.getContext();
		
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		var mvMat_location = gl.getUniformLocation(gl.program, "u_modelViewMatrix");
		var prMat_location = gl.getUniformLocation(gl.program, "u_projectionMatrix");
		var time_location = gl.getUniformLocation(gl.program, "t");
		
    gl.uniformMatrix4fv(mvMat_location, false, gl.modelviewMatrix.getAsWebGLFloatArray());
    gl.uniformMatrix4fv(prMat_location, false, gl.projectionMatrix.getAsWebGLFloatArray());
		gl.uniform1f(time_location, this.wall.time());

		this.sf.draw(gl);
		
		gl.flush();

		// bind with 0, so, switch back to normal pointer operation
		/*
		gl.bindBuffer(gl.ARRAY_BUFFER_ARB, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER_ARB, 0);
		*/
	}

	this.refresh_dls = function() {
		//this.axes_dl = this.axes_dl_gen();
		//this.grid_dl = grid_dl_gen(); 
	}

	this.run = function() {
		/* How does MainLoop work in WebGL? */
		return 0; 
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

		context.projectionMatrix = new CanvasMatrix4();
		context.modelviewMatrix = new CanvasMatrix4();
	
		context.viewport(0, 0, w, h);

		/** Determine the new max x and y based on the
		  * current scale.  This does not shrink or expand
		  * the plot - only changes what's visible.
		  */
		this.scr.maxx = this.scr.minx + (this.scr.maxx - this.scr.minx) * w / this.scr.width;
		this.scr.maxy = this.scr.miny + (this.scr.maxy - this.scr.miny) * h / this.scr.height;

		var avgx = (this.scr.minx + this.scr.maxx);
		var avgy = (this.scr.miny + this.scr.maxy);

		// Set the projection
		context.projectionMatrix.ortho(this.scr.minx - avgx, this.scr.maxx - avgx, this.scr.miny - avgy, this.scr.maxy - avgy, -10, 0);

		// Re-calculate the draw lists if we've expanded the view
		if (w > this.scr.width || h > this.scr.height) {
			this.refresh_dls();
		}
	
		this.scr.width = w;
		this.scr.height = h;
		
		this.sf.initialize(this.scr, context);

		//glutPostRedisplay();
	}
}