uniform vec4 color;

uniform sampler2D knotsTexture;
uniform sampler2D cpsTexture;

varying float u;

void main() {
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	
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