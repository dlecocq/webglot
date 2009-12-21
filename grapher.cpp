#ifndef GRAPHER_CPP
#define GRAPHER_CPP

#include <iostream>
#include <cmath>

#include "grapher.h"

using namespace glot;
using namespace std;

int grapher::initialize(int argc, char ** argv, short int options, short int k_options) {
	
	// Set up the options for display and keyboard
	display_options = options;
	keyboard_options = k_options;
	
	// Initialize bounds
	scr.minx = scr.miny = -5;
	scr.maxx = scr.maxy = 5;
	
	// Width and height of plot
	scr.width = scr.height = 800;
	
	// Initialize GLUT
	glutInit(&argc, argv);
	
	// Set the color mode (double with alpha)
	glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGBA);
	
	// Set the window size and position
	glutInitWindowSize(scr.width, scr.height);
	glutInitWindowPosition(0, 0);
	
	// Title the window
	glutCreateWindow("Glot");
	
	// Initialize OpenGL
	init_open_gl();
	
	// Register callback functions with GLUT
	glutReshapeFunc(reshape);
	glutDisplayFunc(display);
	glutKeyboardFunc(keyboard);
	glutMouseFunc(mouse);
	glutMotionFunc(motion);
	//glutIdleFunc(idle);
	
	// Determine the axes and grid
	axes_dl = axes_dl_gen();
	grid_dl = grid_dl_gen();
	
	glewInit();
	/*
	if (glewIsSupported("GL_VERSION_2_1"))
		printf("Ready for OpenGL 2.1\n");
	else {
		printf("OpenGL 2.1 not supported\n");
		exit(1);
	}
	*/
	
	if (!(GLEW_ARB_vertex_shader && GLEW_ARB_fragment_shader && GLEW_EXT_geometry_shader4)) {
		printf("Not totally ready :( \n");
		exit(1);
	}
	
	framecount = 0;
	
	wall.start();
	
	return 0;
}

int grapher::finalize() {
	glDeleteLists(axes_dl, 1);
	glDeleteLists(grid_dl, 1);
	
	map<primitive*, GLint>::iterator it;
	// For every curve, ...
	for (it = primitives.begin(); it != primitives.end(); ++it) {		
		// Delete the list
		glDeleteLists(it->second, 1);
		delete(it->first);
	}
	
	return 0;
}

// Initialize OpenGL
int grapher::init_open_gl() {
	
	// Enable smoothness and blending
	glEnable(GL_LINE_SMOOTH);
	glEnable(GL_POINT_SMOOTH);
	glEnable(GL_BLEND);
	
	// Other smoothness and blending options
	glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
	//glBlendFunc(GL_ONE, GL_ONE);
	glHint(GL_LINE_SMOOTH_HINT, GL_DONT_CARE);
	
	// Set the line width and point size
	glLineWidth(1.5);
	glPointSize(7);
	
	// Default color is white
	glClearColor(1.0, 1.0, 1.0, 1.0);
	
	return 0;
}

// Our callback function registered with OpenGL
void grapher::display() {
	glClear(GL_COLOR_BUFFER_BIT);
	
	// If Axes-drawing is enabled, draw them
	if (AXES_ON & display_options) {
		glCallList(axes_dl);
	}
	
	// If grid-drawing is enabled, draw it
	if (GRID_ON & display_options) {
		glCallList(grid_dl);
	}

	float t = float(wall.time());
	//scr.time = wall.time();
	
	GLint location;
	
	map<primitive*, GLint>::iterator it;
	// For every curve, ...
	for (it = primitives.begin(); it != primitives.end(); ++it) {
		/** Set its color
		  * 
		  * The motivation here is that the color is not the
		  * hard part of drawing a curve.  So, the draw list
		  * has no color associated with it - only the points.
		  * This makes quickly updating a curve's color very
		  * easy.
		  */
		
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
			/** Set its color
			  * 
			  * See above for the motivation for separating
			  * the color from the draw list
			  */
			glColor4d((*pit)->c.r, (*pit)->c.g, (*pit)->c.b, (*pit)->c.a);
			
			// Draw the point
			glVertex3d((*pit)->x, (*pit)->y, (*pit)->z);
		}
	glEnd();
	
	// Finish up
	glutSwapBuffers();
}

// Our reshaping function, registered with OpenGL
void grapher::reshape(int w, int h) {
	// Set the viewport
	glViewport(0, 0, w, h);
	
	// Deal with the projection
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	
	/** Determine the new max x and y based on the
	  * current scale.  This does not shrink or expand
	  * the plot - only changes what's visible.
	  */
	scr.maxx = scr.minx + (scr.maxx - scr.minx) * w / scr.width;
	scr.maxy = scr.miny + (scr.maxy - scr.miny) * h / scr.height;
	
	// Set the projection
	glOrtho(scr.minx, scr.maxx, scr.miny, scr.maxy, -10, 0);
	glMatrixMode(GL_MODELVIEW);
	
	// Re-calculate the draw lists if we've expanded the view
	if (w > (int)scr.width || h > (int)scr.height) {
		refresh_dls();
	}
	scr.width = w;
	scr.height = h;
	
	// Redisplay the plot
	glLoadIdentity();
	glutPostRedisplay();
}

// Our keyboard function registered with OpenGL
GLvoid grapher::keyboard(unsigned char key, int x, int y) {
	switch (key) {
		case '+':
			if (keyboard_options & ZOOM_KEYS_ON) {
				zoom(1.0 / 1.15);
			}
			break;
		case '-':
			if (keyboard_options & ZOOM_KEYS_ON) {
				zoom(1.15);
			}
			break;
		case 'a':
			if (keyboard_options & AXES_KEYS_ON) {
				display_options = AXES_ON ^ display_options;
				glutPostRedisplay();
			}
			break;
		case 'g':
			if (keyboard_options & GRID_KEYS_ON) {
				display_options = GRID_ON ^ display_options;
				glutPostRedisplay();
			}
			break;
		case 'q':
			if (keyboard_options & QUIT_KEYS_ON) {
				cout << "Quitting." << endl;
				finalize();
				exit(0);
				break;
			}
	}
	
	/** If the user has defined their own keyboard event
	  * handler, execute it here, after we've completed
	  * our own.  They may turn on and off the default
	  * functionality by changing keyboard_options
	  */
	if (user_keyboard_function) {
		user_keyboard_function(key, x, y);
	}
}

// Our mouse funciton, registered with OpenGL
void grapher::mouse(int button, int state, int x, int y) {
	
	// If it's a mouse button being pressed down,
	if (state == GLUT_DOWN) {
		/** Set the x and y coordinates of the mouse where
		  * it is now, so that when it comes up, we can check
		  * if it has moved or not.  If not, then we raise a 
		  * click event.
		  */
		startx = x;
		starty = y;
	} else if (state == GLUT_UP) {
		// See if the mouse has moved since it was pressed
		double dx = get_x_coord(startx) - get_x_coord(x);
		double dy = get_y_coord(starty) - get_y_coord(y);
		
		// If it has moved,
		if (dx != 0 || dy != 0) {
			// then translate the plot by the amount moved
			glMatrixMode(GL_PROJECTION);
			glLoadIdentity();
			scr.minx += dx;
			scr.maxx += dx;
			scr.miny += dy;
			scr.maxy += dy;
			glOrtho(scr.minx, scr.maxx, scr.miny, scr.maxy, -10, 0);
			glMatrixMode(GL_MODELVIEW);
			glLoadIdentity();
			startx = starty = -1;
			refresh_dls();
			glutPostRedisplay();
		} else if (user_click_function) {
			/** Otherwise (if the mouse has not moved), raise
			  * a mouse click event.  If the user has defined
			  * a click handler, call it.
			  */
			user_click_function(button, x, y);
		}
	}
}

void grapher::idle() {
	if (user_idle_function != NULL) {
		user_idle_function();
	}
}

void grapher::motion(int x, int y) {
	double dx = get_x_coord(startx) - get_x_coord(x);
	double dy = get_y_coord(starty) - get_y_coord(y);
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	glOrtho(scr.minx + dx, scr.maxx + dx, scr.miny + dy, scr.maxy + dy, -10, 0);
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	glutPostRedisplay();
}

void grapher::set_keyboard_function(keyboard_function k) {
	user_keyboard_function = k;
}

void grapher::set_click_function(click_function c) {
	user_click_function = c;
}

void grapher::set_idle_function(idle_function i) {
	glutIdleFunc(i);
}

void grapher::zoom(double scale) {
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	double diff = (scr.maxx - scr.minx) * scale / 2.0;
	double mid = (scr.maxx + scr.minx) / 2.0;
	scr.minx = mid - diff;
	scr.maxx = mid + diff;
	
	diff = (scr.maxy - scr.miny) * scale / 2.0;
	mid = (scr.maxy + scr.miny) / 2.0;
	scr.miny = mid - diff;
	scr.maxy = mid + diff;
	
	glOrtho(scr.minx, scr.maxx, scr.miny, scr.maxy, -10, 0);
	//glViewPort()
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	
	refresh_dls();
	glutPostRedisplay();
}

double grapher::get_x_coord(GLint x) {
	return scr.minx + (scr.maxx - scr.minx) * ((double)x / scr.width);
}

double grapher::get_y_coord(GLint y) {
	return scr.maxy - (scr.maxy - scr.miny) * (double)y / scr.height;
}

point grapher::get_point(GLint x, GLint y) {
	return point(scr.minx + (scr.maxx - scr.minx) * ((double)x / scr.width), scr.maxy - (scr.maxy - scr.miny) * (double)y / scr.height, 0, NULL);
}

GLint grapher::axes_dl_gen() {
	GLint dl = glGenLists(1);
	
	glNewList(dl, GL_COMPILE);
	
		glColor4d(0.0, 0.0, 0.0, 1.0);
		
		glBegin(GL_LINES);
		
			glVertex3d(0, scr.miny, 0);
			glVertex3d(0, scr.maxy, 0);
			glVertex3d(scr.minx, 0, 0);
			glVertex3d(scr.maxx, 0, 0);
		
		glEnd();
	
	glEndList();
	
	return dl;
}

GLint grapher::grid_dl_gen() {
	GLint dl = glGenLists(1);
	
	glNewList(dl, GL_COMPILE);
	
		glColor4d(0.0, 0.0, 0.0, 0.14);
	
		glBegin(GL_LINES);
		
			for ( int i = (int)scr.miny; i <= (int)scr.maxy; ++i) {
				glVertex3d(scr.minx, i, 1);
				glVertex3d(scr.maxx, i, 1);
			}
	
			for ( int i = (int) scr.minx; i <= scr.maxx; ++i) {
				glVertex3d(i, scr.miny, 1);
				glVertex3d(i, scr.maxy, 1);
			}
		
		glEnd();
		
	glEndList();
	
	return dl;
}

void grapher::add(primitive& p) {
	primitives[&p] = glGenLists(1);
	glNewList(primitives[&p], GL_COMPILE);
		(&p)->dl_gen(scr);
	glEndList();
}

void grapher::remove(primitive& p) {
	glDeleteLists(primitives[&p], 1);
	primitives.erase(&p);
}

void grapher::add(point& p) {
	points.push_back(&p);
}

void grapher::remove(point& p) {
	points.remove(&p);
}

void grapher::refresh_dls() {
	
	glDeleteLists(axes_dl, 1);
	glDeleteLists(grid_dl, 1);
	axes_dl = axes_dl_gen();
	grid_dl = grid_dl_gen();
	
	map<primitive*, GLint>::iterator it;
	for (it = primitives.begin(); it != primitives.end(); ++it) {
		glDeleteLists(it->second, 1);
		primitives[it->first] = glGenLists(1);
		glNewList(primitives[it->first], GL_COMPILE);
			(*it->first).dl_gen(scr);
		glEndList();
	}
}

double grapher::y_coord_transform(double y) {
	if (Y_LOG & display_options) {
		return log10(abs(y));
	} else {
		return y;
	}
}

double grapher::x_coord_transform(double x) {
	if (X_LOG & display_options) {
		return pow(10, x);
	} else {
		return x;
	}
}

//*
double grapher::x_plot_coord(double x) {
	if (X_LOG & display_options) {
		return pow(10,x);
	} else {
		return x;
	}
}

double grapher::x_screen_coord(double x) {
	if (X_LOG & display_options) {
		return log10(abs(x));
	} else {
		return x;
	}
}

double grapher::y_plot_coord(double y) {
	if (Y_LOG & display_options) {
		return pow(10, y);
	} else {
		return y;
	}
}

double grapher::y_screen_coord(double y) {
	if (Y_LOG & display_options) {
		return log10(abs(y));
	} else {
		return y;
	}
}
//*/

void grapher::refresh() {
	// Delete this!
	refresh_dls();
}

void grapher::redraw() {
	if (framecount == 0) {
		timer.start();
	}
	glFinish();
	glutPostRedisplay();
	++framecount;
	if (framecount == 500) {
		framecount = 0;
		cout << 500 / timer.stop() << " fps" << endl;
	}
}

void grapher::run() {
	glutMainLoop();
}

GLint grapher::get_width() {
	return scr.width;
}

GLint grapher::get_height() {
	return scr.height;
}

void grapher::get_pixels(char* values) {
	glReadPixels(0, 0, scr.width, scr.height, GL_RGB, GL_UNSIGNED_BYTE, values);
}

// Static member variable definition
// It's terribly ugly, I know
screen grapher::scr;
short int grapher::display_options;
short int grapher::keyboard_options;
GLint grapher::axes_dl;
GLint grapher::grid_dl;
int grapher::startx;
int grapher::starty;
map<primitive*, GLint> grapher::primitives;
list<point*> grapher::points;
grapher::keyboard_function grapher::user_keyboard_function;
grapher::click_function grapher::user_click_function;
grapher::idle_function grapher::user_idle_function;
stopwatch grapher::timer;
stopwatch grapher::wall;

int grapher::framecount;

#endif
