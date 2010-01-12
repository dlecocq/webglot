uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

uniform float dx;
uniform float dy;

attribute vec4 position;

uniform float t;

// USER_PARAMETERS

float function(float x) {
	return USER_FUNCTION;
}

void main() {
	
	float x = position.x + dx;
	
	gl_Position = projectionMatrix * modelviewMatrix * vec4(position.x + dx, function(x), 0.0, 1.0);
}