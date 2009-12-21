#ifndef SHADER_PRIMITIVE
#define SHADER_PRIMITIVE

#include <iostream>

#include "shader_primitive.h"

using namespace glot;
using namespace std;

void shader_primitive::printShaderInfoLog(GLuint obj)
{
	GLint infologLength = 0;
	GLsizei charsWritten  = 0;
	char *infoLog;
	glGetShaderiv(obj, GL_INFO_LOG_LENGTH, &infologLength);
	if (infologLength > 0) {
		infoLog = (char *)malloc(infologLength);
		glGetShaderInfoLog(obj, infologLength, &charsWritten, infoLog);
		cout << infoLog << endl;
		free(infoLog);
	} else {
		cout << "OK" << endl;
	}
}

void shader_primitive::printProgramInfoLog(GLuint obj)
{
	GLint infologLength = 0;
	GLsizei charsWritten  = 0;
	char *infoLog;
	glGetProgramiv(obj, GL_INFO_LOG_LENGTH,&infologLength);
	if (infologLength > 0) {
		infoLog = (char*)malloc(infologLength);
		glGetProgramInfoLog(obj, infologLength, &charsWritten, infoLog);
		cout << infoLog << endl;
    free(infoLog);
	}else{
		cout << "OK" << endl;
	}
}

string shader_primitive::read_file(const char * filename) {
	string program;
	string line;
	
	ifstream ifs(filename);
	while(getline(ifs, line)) {
		program += line + "\n";
	}
	ifs.close();
	
	return program;
}

#endif