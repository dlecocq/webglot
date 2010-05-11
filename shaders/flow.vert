uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

uniform float dx;
uniform float dy;
uniform float scale;

// USER_PARAMETERS

attribute vec4 position;
attribute vec2 aTextureCoord;

varying float magnitude;

uniform float t;

varying vec2 vTextureCoord;

const float h = 0.001;
const float dt = 0.01;

float function(float x, float y) {
	return USER_FUNCTION;
}

void main() {
	float x = (position.x + dx) * scale;
	float y = (position.y + dy) * scale;
	
	vec2 hi = vec2(function(x + dt, y), function(x, y + dt));
	vec2 lo = vec2(function(x - dt, y), function(x, y - dt));
	
	vec2 d = (hi - lo) / (2.0 * dt);
	
	magnitude = length(d);

	/*
	vec4 result = vec4(x + h * d.x, y + h * d.y, 0.0, 1.0);
	gl_Position = u_projectionMatrix * result;
	vTextureCoord = aTextureCoord;// - 5.0 * h * d;
	//*/
	
	//*
	gl_Position = projectionMatrix * position;
	vTextureCoord = aTextureCoord - h * normalize(d);
	//*/
}