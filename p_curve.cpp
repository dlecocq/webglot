#ifndef P_CURVE_CPP
#define P_CURVE_CPP

#include "p_curve.h"

using namespace glot;

void p_curve::dl_gen(const screen& scr) {
	
	int count = 1000;
	double h = (tfinal - tstart) / count;
	
	glBegin(GL_LINE_STRIP);
		for (int i = 0; i < count; ++i) {
			glVertex3d(i * h, 0, 0);
		}
	glEnd();
}

void p_curve::gen_shader() {	
	v = glCreateShader(GL_VERTEX_SHADER);
	string vert_src = read_file("shaders/p_curve.vert.1") + func + read_file("shaders/p_curve.vert.2");
	
	if (layout & POLAR) {
		vert_src += "gl_Position = vec4(gl_Position.y * cos(gl_Position.x), gl_Position.y * sin(gl_Position.x), 0.0, 1.0);";
	}
	
	vert_src += read_file("shaders/p_curve.vert.3");
	
	const GLchar * vs_src = vert_src.c_str();

	glShaderSource(v, 1, &vs_src, NULL);

	glCompileShader(v);

	p = glCreateProgram();

	glAttachShader(p,v);

	glLinkProgram(p);

	cout << "Vertex shader : ";
	printShaderInfoLog(v);

	cout << "Program : ";
	printProgramInfoLog(p);
}

#endif