#ifndef FLOW_CPP
#define FLOW_CPP

#include <iostream>
#include <fstream>

#include "flow.h"

using namespace std;
using namespace glot;

void flow::dl_gen(const screen& scr) {
	glBegin(GL_POINTS);
	
		//*
		unsigned int i = 0, j = 0;
		
		unsigned int count = 10;
		
		double dx = (scr.maxx - scr.minx) / count;
		double dy = (scr.maxy - scr.miny) / count;
	
		for (i = 0; i <= count; ++i) {
			for (j = 0; j <= count; ++j) {
				glVertex3d(i * dx + scr.minx, j * dy + scr.miny, 0);
			}
		}
		//*/
		
		//glVertex3d(1, 0, 0);

	glEnd();
}


string flow::get_geom_shader() {
	return read_file("shaders/flow.geom.front") + func + read_file("shaders/flow.geom.back");
}

string flow::get_vert_shader() {
	return read_file("shaders/flow.vert");
}

void flow::gen_shader() {
	
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
	glProgramParameteriEXT(p, GL_GEOMETRY_INPUT_TYPE_EXT,  GL_POINTS);
	glProgramParameteriEXT(p, GL_GEOMETRY_OUTPUT_TYPE_EXT, GL_LINE_STRIP);
	GLint temp;
	glGetIntegerv(GL_MAX_GEOMETRY_OUTPUT_VERTICES_EXT, &temp);
	cout << "Can output " << temp << " vertices" << endl;
	glProgramParameteriEXT(p, GL_GEOMETRY_VERTICES_OUT_EXT, temp);
	
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
