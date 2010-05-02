uniform vec4 color;

uniform sampler2D knotsTexture;

varying float sp;

void main() {
	//gl_FragColor = vec4(1.0, 0.0, 0.0, sp);
	gl_FragColor = texture2D(knotsTexture, vec2(sp, 0.0));
	gl_FragColor.a = 1.0;
}