uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D knotsTexture;
uniform sampler2D cpsTexture;

attribute vec4 position;

varying float sp;

uniform float t;

// USER_PARAMETERS

vec4 function(float s) {
	return vec4(USER_FUNCTION, s, 0.0, 1.0);
}

void main() {
	vec4 result = function(position.x);
	
	sp = position.x;
	
	vec4 knotsValue = texture2D(knotsTexture, vec2(sp, 0.0));
	vec4 cpsValue   = texture2D(cpsTexture  , vec2(sp, 0.0));
	
	//result.x = cpsValue.y;
	result.x = knotsValue.x;
	
	// COORDINATE_TRANSFORMATION
	
	gl_Position = projectionMatrix * modelviewMatrix * result;
}