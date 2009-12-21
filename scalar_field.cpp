#ifndef SCALAR_FIELD_CPP
#define SCALAR_FIELD_CPP

#include <iostream>
#include <fstream>

#include "scalar_field.h"

using namespace glot;

void scalar_field::dl_gen(const screen& s) {
	glBegin(GL_QUADS);
		glTexCoord2f(s.minx, s.miny);
			glVertex3f(s.minx, s.miny, 0);
		glTexCoord2f(s.minx, s.maxy);
			glVertex3f(s.minx, s.maxy, 0);
		glTexCoord2f(s.maxx, s.maxy);
			glVertex3f(s.maxx, s.maxy, 0);
		glTexCoord2f(s.maxx, s.miny);
			glVertex3f(s.maxx, s.miny, 0);
	glEnd();
}

void scalar_field::gen_shader() {
	string program = read_file("shaders/scalar.frag.front") + func + read_file("shaders/scalar.frag.back");
	
	//std::cout << program << std::endl;

	GLhandleARB frag = glCreateShader(GL_FRAGMENT_SHADER);

	const GLchar * ff = program.c_str();

	glShaderSource(frag, 1, &ff, NULL);

	glCompileShader(frag);

	p = glCreateProgram();
	
	glAttachShader(p,frag);
	
	glLinkProgram(p);
	
	glDeleteShader(frag);
}

#endif
