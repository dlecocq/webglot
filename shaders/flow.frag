varying vec2 vTextureCoord;

uniform sampler2D accumulation;
uniform sampler2D source;

varying float magnitude;

uniform float t;

const float alpha = 0.05;

vec2 function(float x, float y) {
	return vec2(USER_FUNCTION);
}

vec4 color(float value) {
	float red = 1.0;
	float green = 1.0;
	float blue = 0.0;

	if (value > 0.8) {
		red = (value - 0.8) * 5.0;
		green = 0.0;
		blue = 1.0;
	} else if (value > 0.6) {
		red = 0.0;
		green = (0.8 - value) * 5.0;
		blue = 1.0;
	} else if (value > 0.4) {
		red = (0.6 - value) * 5.0;
		green = 1.0;
		blue = (value - 0.4) * 5.0;
	} else if (value > 0.2) {
		red = 1.0;
		green = 0.5 + (value - 0.2) * 2.5;
	} else {
		red = 1.0;
		green = (value) * 2.5;
	}

	return vec4(red, green, blue, 1.0);
}

void main() {
	vec4 result = texture2D(accumulation, vTextureCoord.st);
	
	result.a = 1.0;
	
	vec4 s = texture2D(source, vec2(vTextureCoord.s, 1.0 - vTextureCoord.t));
	s = color(magnitude / 20.0) * s.r;
	//s.r = s.g = s.b = mod(t / 20.0 + s.r, 1.0);
	//s.a = mod(t / 20.0 + s.a, 1.0);

	gl_FragColor = alpha * s + (1.0 - alpha) * result;
}