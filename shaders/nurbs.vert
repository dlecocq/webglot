uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D knotsTexture;
uniform sampler2D cpsTexture;

attribute vec4 position;
attribute float l;

varying float sp;

uniform float t;

vec4  ds[DEGREE + 1];
float as[DEGREE + 1];

// USER_PARAMETERS

vec4 function(float s) {
	return vec4(USER_FUNCTION, s, 0.0, 1.0);
}

void main() {
	vec4 result = function(position.x);
	
	sp = position.x;
	
	vec4 knotsValue = texture2D(knotsTexture, vec2(sp, 0.0));
	vec4 cpsValue   = texture2D(cpsTexture  , vec2(sp, 0.0));
	
	result.x = l;
	
	// COORDINATE_TRANSFORMATION
	
	gl_Position = projectionMatrix * modelviewMatrix * result;
}