uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;

attribute vec4 vPosition;

uniform float t;

const float h = 0.1;

vec2 function(float x, float y) {
	return vec2(USER_FUNCTION);
}

void main() {
	float x = vPosition.x;
	float y = vPosition.y;
	
	vec2 d = function(x, y);
	
	vec4 result = vec4(x + h * d.x, y + h * d.y, 0.0, 1);
	
	gl_Position = u_projectionMatrix * result;
}