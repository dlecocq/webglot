uniform vec4 color;

uniform sampler2D knotsTexture;
uniform sampler2D cpsTexture;

varying float sp;

void main() {
	//gl_FragColor = vec4(1.0, 0.0, 0.0, sp);
	
	/*
	// Testing whether or not we have access to knotsTexture
	gl_FragColor = texture2D(knotsTexture, vec2(sp, 0.0));
	gl_FragColor.a = 1.0;
	//*/
	
	gl_FragColor = texture2D(cpsTexture, vec2(sp, 0.0));
	gl_FragColor.a = 1.0;
}