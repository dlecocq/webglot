uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 position;

uniform float t;
uniform float scale;

// USER_PARAMETERS

vec4 function(float s) {
	return vec4(USER_FUNCTION, 0, 1);
}

void main() {
	vec4 result = function(position.x);
	
	// COORDINATE_TRANSFORMATION
	
	result.xy /= scale;
	
	gl_Position = projectionMatrix * modelviewMatrix * result;
}