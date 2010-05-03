uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 position;
uniform float scale;

void main() {
	vec4 result = position;
	result.xy /= scale;
	gl_Position = projectionMatrix * modelviewMatrix * result;
}