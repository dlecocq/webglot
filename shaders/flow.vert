uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;

attribute vec4 vPosition;
attribute vec2 aTextureCoord;

uniform float t;

varying vec2 vTextureCoord;

const float h = 2.0;

vec2 function(float x, float y) {
	return vec2(USER_FUNCTION);
}

void main() {
	float x = vPosition.x;
	float y = vPosition.y;
	
	vec2 d = function(x, y);
	
	//vec4 result = vec4(x + h * d.x, y + h * d.y, 0.0, 1);
	
	gl_Position = u_projectionMatrix * vPosition;
	
	vec2 result = vec2(h * d.x, h * d.y);
	
	vTextureCoord = aTextureCoord - result;
}