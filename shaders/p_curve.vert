uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 position;

uniform float t;

// USER_PARAMETERS

void main() {
	float s = position.x;
	gl_Position = projectionMatrix * modelviewMatrix * vec4(USER_FUNCTION, 0, 1);
}