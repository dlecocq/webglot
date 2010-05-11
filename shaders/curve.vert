uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

uniform float dx;
uniform float dy;

uniform float scale;

attribute vec4 position;

uniform float t;

// USER_PARAMETERS

float function(float x) {
	return USER_FUNCTION;
}

void main() {
	
	vec4 result = vec4(position.x + dx, function(scale * (position.x + dx)), 0.0, 1.0);
	result.y = result.y / scale;

	// COORDINATE_TRANSFORMATION
	
	gl_Position = projectionMatrix * modelviewMatrix * result;
}