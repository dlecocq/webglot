#ifndef CURVE_CPP
#define CURVE_CPP

#include <iostream>
#include <fstream>

#include "curve.h"

using namespace glot;

void curve::dl_gen(const screen& s) {

	glBegin(GL_LINE_STRIP);
	
		double a = s.minx;
		glVertex3d(a, 0, s.time);
		for (int i = 0; i < s.width; ++i) {
			a = (i + 1) * (s.maxx - s.minx) / s.width + s.minx;
			glVertex3d(a, 0, s.time);
		}
	
	glEnd();
}

string curve::get_geom_shader() {
	string program = read_file("shaders/curve.geom.1") + func + read_file("shaders/curve.geom.2");
	if (layout & X_LOG) {
		program += "x = pow(10.0, x);\n";
		program += read_file("shaders/curve.geom.3");
		program += "gl_Position.x = log(gl_Position.x) / log(10.0);\n";
	} else {
		program += read_file("shaders/curve.geom.3");	
	}
	
	if (layout & Y_LOG) {
		program += "gl_Position.y = log(gl_Position.y) / log(10.0);\n";
	}
	
	if (layout & POLAR) {
		program += "gl_Position = vec4(gl_Position.y * cos(gl_Position.x), gl_Position.y * sin(gl_Position.x), 0.0, 1.0);";
	}
	
	program += read_file("shaders/curve.geom.4");
	return program;
}

string curve::get_vert_shader() {
	return read_file("shaders/curve.vert");
}

string curve::get_frag_shader() {
	return read_file("shaders/cruve.frag");
}

void curve::gen_shader() {
	
	//f = glCreateShader(GL_FRAGMENT_SHADER);
	v = glCreateShader(GL_VERTEX_SHADER);
	g = glCreateShader(GL_GEOMETRY_SHADER_EXT);
	
	//string frag_src = get_frag_shader();
	string vert_src = get_vert_shader();
	string geom_src = get_geom_shader();
	
	//const GLchar * fs_src = frag_src.c_str();
	const GLchar * vs_src = vert_src.c_str();
	const GLchar * gs_src = geom_src.c_str();	

	//glShaderSource(f, 1, &fs_src, NULL);
	glShaderSource(v, 1, &vs_src, NULL);
	glShaderSource(g, 1, &gs_src, NULL);
	
	//glCompileShader(f);
	glCompileShader(v);
	glCompileShader(g);
	
	p = glCreateProgram();
	
	//glAttachShader(p,f);
	glAttachShader(p,v);
	glAttachShader(p,g);
	
	// It has to be GL_LINES as input, GL_LINE_STRIP as output?
	glProgramParameteriEXT(p, GL_GEOMETRY_INPUT_TYPE_EXT,  GL_LINES);
	//glProgramParameteriEXT(p, GL_GEOMETRY_OUTPUT_TYPE_EXT, GL_POINTS);
	glProgramParameteriEXT(p, GL_GEOMETRY_OUTPUT_TYPE_EXT, GL_LINE_STRIP);
	/*
	GLint temp;
	glGetIntegerv(GL_MAX_GEOMETRY_OUTPUT_VERTICES_EXT, &temp);
	//*/
	glProgramParameteriEXT(p, GL_GEOMETRY_VERTICES_OUT_EXT, 40);
	
	glLinkProgram(p);
	
	glDeleteShader(v);
	glDeleteShader(g);
	
	//cout << "Fragment shader : ";
	//printShaderInfoLog(f);
	
	cout << "Vertex shader : ";
	printShaderInfoLog(v);
	
	cout << "Geometry shader : ";
	printShaderInfoLog(g);
	
	cout << "Program : ";
	printProgramInfoLog(p);
}

#endif
