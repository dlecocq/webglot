varying vec2 vTextureCoord;

uniform sampler2D accumulation;
uniform sampler2D source;

uniform float t;

const float alpha = 0.01;

vec2 function(float x, float y) {
	return vec2(USER_FUNCTION);
}

void main() {
	vec4 result = texture2D(accumulation, vTextureCoord.st);//vec2(vTextureCoord.s, 1.0 - vTextureCoord.t));
	// Scaled periodicity
	//result.r = result.g = result.b = abs(sin(t * result.r));
	// Phase shift
	//result.r = result.g = result.b = mod(t / 20.0 + result.r, 1.0);
	
	//result.r = result.g = result.b = result.r;
	
	result.a = 1.0;
	
	vec4 s = texture2D(source, vec2(vTextureCoord.s, 1.0 - vTextureCoord.t));
	//s.r = s.g = s.b = mod(t / 20.0 + s.r, 1.0);
	s.a = mod(t / 20.0 + s.a, 1.0);
	//result.a = length(function(vTextureCoord.s, vTextureCoord.t)) / 10.0;
	//result.a = mod(t / 20.0 + result.a, 0.5);
	gl_FragColor = alpha * s + (1.0 - alpha) * result;
}