uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;

uniform float dx;
uniform float dy;

attribute vec4 vPosition;

uniform float t;

// USER_PARAMETERS

float function(float x) {
	return USER_FUNCTION;
}

void main() {
	
	float x = vPosition.x + dx;
	
	gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(vPosition.x + dx, function(x), 0.0, 1.0);
}