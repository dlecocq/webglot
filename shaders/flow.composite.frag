varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float t;

const float alpha = 1.0;

vec2 function(float x, float y) {
	return vec2(USER_FUNCTION);
}

void main() {
  vec4 result = texture2D(uSampler, vTextureCoord.st);
	// Scaled periodicity
	//result.r = result.g = result.b = abs(sin(t * result.r));
	// Phase shift
	result.r = result.g = result.b = mod(t / 20.0 + result.r, 1.0);
	
	//result.r = result.g = result.b = result.r;
	//result.a = length(function(vTextureCoord.s, vTextureCoord.t)) / 10.0;
	//result.a = mod(t / 20.0 + result.a, 0.5);
	result.a = 0.75;
	gl_FragColor = result;
}