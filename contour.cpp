#ifndef CONTOUR_CPP
#define CONTOUR_CPP

#include <iostream>
#include <fstream>

#include "contour.h"

using namespace std;
using namespace glot;

void contour::dl_gen(const screen& scr) {
	glBegin(GL_LINES);
	
		unsigned int i = 0, j = 0;
		
		unsigned int count = 100;
		
		double dx = (scr.maxx - scr.minx) / count;
		double dy = (scr.maxy - scr.miny) / count;
	
		for (i = 0; i < count; ++i) {
			for (j = 0; j < count; ++j) {
				glVertex3d(     i  * dx + scr.minx,      j  * dy + scr.miny, 0);
				glVertex3d((1 + i) * dx + scr.minx, (1 + j) * dy + scr.miny, 0);
			}
		}

	glEnd();
}


string contour::get_geom_shader() {
	return read_file("shaders/contour.geom.front") + func + read_file("shaders/contour.geom.back");
}

string contour::get_vert_shader() {
	return read_file("shaders/contour.vert");
}

void contour::gen_shader() {
	
	// f = glCreateShader(GL_FRAGMENT_SHADER);
	v = glCreateShader(GL_VERTEX_SHADER);
	g = glCreateShader(GL_GEOMETRY_SHADER_EXT);
	
	// string frag_src = get_frag_shader();
	string vert_src = get_vert_shader();
	string geom_src = get_geom_shader();
	
	// const GLchar * fs_src = frag_src.c_str();
	const GLchar * vs_src = vert_src.c_str();
	const GLchar * gs_src = geom_src.c_str();	

	// glShaderSource(f, 1, &fs_src, NULL);
	glShaderSource(v, 1, &vs_src, NULL);
	glShaderSource(g, 1, &gs_src, NULL);
	
	// glCompileShader(f);
	glCompileShader(v);
	glCompileShader(g);
	
	p = glCreateProgram();
	
	// glAttachShader(p,f);
	glAttachShader(p,v);
	glAttachShader(p,g);
	
	// It has to be GL_LINES as input, GL_LINE_STRIP as output?
	glProgramParameteriEXT(p, GL_GEOMETRY_INPUT_TYPE_EXT,  GL_LINES);
	glProgramParameteriEXT(p, GL_GEOMETRY_OUTPUT_TYPE_EXT, GL_LINE_STRIP);
	/*
	GLint temp;
	glGetIntegerv(GL_MAX_GEOMETRY_OUTPUT_VERTICES_EXT, &temp);
	//*/
	glProgramParameteriEXT(p, GL_GEOMETRY_VERTICES_OUT_EXT, 10);
	
	glLinkProgram(p);
	
	// cout << "Fragment shader : ";
	// printShaderInfoLog(f);
	
	cout << "Vertex shader : ";
	printShaderInfoLog(v);
	
	cout << "Geometry shader : ";
	printShaderInfoLog(g);
	
	cout << "Program : ";
	printProgramInfoLog(p);
}

#endif
