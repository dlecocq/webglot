uniform vec4 color;

uniform sampler2D knotsTexture;
uniform sampler2D cpsTexture;

varying float u;

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
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	gl_FragColor = color(u);
	
	/*
	// Testing whether or not we have access to knotsTexture
	gl_FragColor = texture2D(knotsTexture, vec2(u, 0.0));
	gl_FragColor.a = 1.0;
	//*/
	
	/*
	gl_FragColor = texture2D(cpsTexture, vec2(u, 0.0));
	gl_FragColor.a = 1.0;
	//*/
}