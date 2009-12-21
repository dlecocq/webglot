#version 120 
#extension GL_EXT_geometry_shader4 : enable

void main () {
	
	//vec4 result = gl_Vertex;
	
	//float x = result.x;
	//result.y = x * x;
	
	//gl_Position = gl_ModelViewProjectionMatrix * result;
	gl_Position = gl_Vertex;
	
}