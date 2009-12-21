// This class will encapsulate the grapher
grapher = function() {}

grapher.prototype.initialize = function() {
	
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
  var gl = this.context = canvas.getContext("experimental-webgl");
  if (!this.context) {
      alert("No WebGL context found");
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
	
	// Other smoothness and blending options
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.hint(gl.LINE_SMOOTH_HINT, gl.DONT_CARE);
	
	// Set the line width and point size
	gl.lineWidth(1.5);
	gl.pointSize(7);
	
	// Default color is white
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	// This was included in the webkit examples, but my JavaScript
	// is weak, and I'm not quite sure what exactly this means.
  // Add a console
  canvas.console = ("console" in window) ? window.console : { log: function() { } };
	
	this.scr = new screen();
	
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
	
	// Determine the axes and grid
	this.axes_dl = axes_dl_gen();
	this.grid_dl = grid_dl_gen();
	
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
	
	// In the future, this ought to return some encoded value of success or failure.
	return 0;
}

grapher.prototype.axes_dl_gen = function() {
	var dl = glGenLists(1);
	
	glNewList(dl, GL_COMPILE);
	
		glColor4d(0.0, 0.0, 0.0, 1.0);
		
		glBegin(GL_LINES);
		
			glVertex3d(            0, this.scr.miny, 0);
			glVertex3d(            0, this.scr.maxy, 0);
			glVertex3d(this.scr.minx,             0, 0);
			glVertex3d(this.scr.maxx,             0, 0);
		
		glEnd();
	
	glEndList();
	
	return dl;
}

grapher.prototype.grid_dl_gen = function() {
	var dl = glGenLists(1);
	
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

grapher.prototype.display = function() {
	var gl = this.context;
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	gl.callList(this.axes_dl);
	gl.callList(this.grid_dl);
	
	/* In this preliminary version, all options are temporarily defaulted
	 * to true.  List in the future iterations.
	 */
	/*
	// If Axes-drawing is enabled, draw them
	if (AXES_ON & display_options) {
		glCallList(axes_dl);
	}
	
	// If grid-drawing is enabled, draw it
	if (GRID_ON & display_options) {
		glCallList(grid_dl);
	}
	*/

	// Determine timing stuff
	//float t = float(wall.time());
	//scr.time = wall.time();
	
	// For use in shader programs
	// GLint location;
	
	/* This section will require massive structural changes.  I think
	 * that JavaScript's dynamic typing will work to our advantage here
	 * but that's uncertain at this point.  I'm not sure if JavaScript
	 * supports inheritance (in which case the current model will likely
	 * suffice) or if there will even have to be any inheritance at all.
	 */
	/*
	map<primitive*, GLint>::iterator it;
	// For every curve, ...
	for (it = primitives.begin(); it != primitives.end(); ++it) {
		
		// Call it's shader program, defaulted to 0
		glUseProgram(it->first->p);
		
		location = glGetUniformLocation(it->first->p, "t");
		
		glUniform1f(location, t);
		
		glColor4d(it->first->c.r, it->first->c.g, it->first->c.b, it->first->c.a);
		// Call the actual draw list
		glCallList(it->second);
		//it->first->dl_gen(scr);
		
		// Re-set the shader program to 0
		glUseProgram(0);
	}
	
	list<point*>::iterator pit;
	glBegin(GL_POINTS);
		// For every point, ...
		for (pit = points.begin(); pit != points.end(); ++pit) {
			glColor4d((*pit)->c.r, (*pit)->c.g, (*pit)->c.b, (*pit)->c.a);
			
			// Draw the point
			glVertex3d((*pit)->x, (*pit)->y, (*pit)->z);
		}
	glEnd();
	*/
	
	/* From the initial reading of the WebGL spec, it seems like WebGL
	 * guarantees the swapping of buffers, and flushing, etc.
	 */
	// Finish up
	//glutSwapBuffers();
}

grapher.prototype.refresh_dls = function() {
	this.axes_dl = axes_dl_gen();
	this.grid_dl = grid_dl_gen();
}

grapher.prototype.run = function() {
	/* How does MainLoop work in WebGL? */
	return 0; 
}

grapher.prototype.reshape = function(context) {
	var canvas = document.getElementById('example');
	
	var w = canvas.clientWidth;
	var h = canvas.clientHeight;
	
	/* If the width and height of the resized canvas are already
	 * the stored sizes, return and do nothing.
	 */
	if (w == this.scr.width && h == this.scr.height) {
		return;
	}

	/* Perhaps this extrapolation to the CanvasMatrix4 is a result
	 * of no support for LoadIdentity().  However, I will proceed
	 * as if there is still support for LoadIdentity - I'd rather
	 * not fix it if it's not broken, at least in the early stages
	 */
	/*
	context.perspectiveMatrix = new CanvasMatrix4();
	context.perspectiveMatrix.lookat(0,0,20, 0, 0, 0, 0, 1, 0);
	context.perspectiveMatrix.perspective(30, width/height, 1, 10000);
	*/
	
	context.matrixMode(context.PROJECTION);
	context.loadIdentity();
	
	context.viewport(0, 0, w, h);

	/** Determine the new max x and y based on the
	  * current scale.  This does not shrink or expand
	  * the plot - only changes what's visible.
	  */
	this.scr.maxx = this.scr.minx + (this.scr.maxx - this.scr.minx) * w / this.scr.width;
	this.scr.maxy = this.scr.miny + (this.scr.maxy - this.scr.miny) * h / this.scr.height;

	// Set the projection
	context.Ortho(this.scr.minx, this.scr.maxx, this.scr.miny, this.scr.maxy, -10, 0);
	context.matrixMode(context.MODELVIEW);
	glLoadIdentity();

	// Re-calculate the draw lists if we've expanded the view
	if (w > this.scr.width || h > this.scr.height) {
		refresh_dls();
	}
	
	this.scr.width = w;
	this.scr.height = h;

	glutPostRedisplay();
}