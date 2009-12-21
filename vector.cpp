#ifndef VECTOR_CPP
#define VECTOR_CPP

#include <cmath>

#include "vector.h"

using namespace glot;

void vector::dl_gen(const screen& scr) {
	glMatrixMode(GL_MODELVIEW);
	glPushMatrix();
	glLoadIdentity();
	glRotated(atan2(end.y - start.y, end.x - start.x) * 180.0 / M_PI, 0, 0, 1);
	glTranslated(start.x, start.y, 0);

	glBegin(GL_LINE_STRIP);
	
		glVertex3d(0, 0, 0);
		glVertex3d(0, 0.75, 0);

	glEnd();
	glBegin(GL_LINE_STRIP);

		glVertex3d(0, 1, 0);
		glVertex3d(0.15, 0.75, 0);
		glVertex3d(-0.15, 0.75, 0);
		glVertex3d(0, 1, 0);

	glEnd();

	glPopMatrix();
}

#endif
