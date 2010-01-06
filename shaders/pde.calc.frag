varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float t;

const float texdy = 1.0 / 400.0;
const float texdx = 1.0 / 1042.0;

const float dy = 2.0 / 400.0;
const float dx = 2.0 / 1042.0;

const float alpha = 1.0;

const float omega = 30.0;

float uxx(float x, float y, float t) {
	//return -2.0 * (1.0 + y) * (1.0 - y);
	//return -omega * omega * sin(omega * x) * cos(omega * y);
	return -omega * omega * sin(omega * x);
	//float a = x * x + y * y;
	//return ((x * x / a - 1.0) / sqrt(a)) * omega * omega * sin(omega * sqrt(a));
}

float uyy(float x, float y, float t) {
	//return -2.0 * (1.0 + x) * (1.0 - x);
	//return -omega * omega * cos(omega * y) * sin(omega * x);
	//return -omega * omega * cos(omega * y - t);
	return -omega * omega * cos(omega * y);
	//float a = x * x + y * y;
	//return ((y * y / a - 1.0) / sqrt(a)) * omega * omega * sin(omega * sqrt(a));
}

float f(float x, float y, float t) {
	return uxx(x, y, t) + uyy(x, y, t);
}

float u_f(float x, float y, float t) {
	//return sin(omega * x) + cos(omega * y);
	//return sin(omega * x) + cos(omega * y - t);
	//return sin(sqrt(x * x + y * y));
	//return 20.0 * sin(t * x);
	return 0.0;
}

void main () {
	vec2 coord = vTextureCoord.xy;
	
	//gl_FragColor = texture2D(uSampler, coord) + vec4(0.0, 0.0, 0.1, 1.0);
	//*
	float texx = coord.x;
	float texy = coord.y;
	
	float x = coord.x * 2.0 - 1.0;
	float y = coord.y * 2.0 - 1.0;
	
	if (texx <= texdx) {
		gl_FragColor = vec4(u_f(x, y, t), 0.0, 0.0, 1.0);	
	} else if (texx >= (1.0 - texdx)) {
		// If a pixel is on the x boundary
		gl_FragColor = vec4(u_f(x, y, t), 0.0, 0.0, 1.0);
	} else if (texy <= texdy) {
		gl_FragColor = vec4(u_f(x, y, t), 0.0, 0.0, 1.0);
	} else if (texy >= (1.0 - texdy)) {
		// If a pixel is on the y boundary
		gl_FragColor = vec4(u_f(x, y, t), 0.0, 0.0, 1.0);
	} else {
		float u_xlo = texture2D(uSampler, vec2(texx - texdx, texy				 )).r;
		float u_xhi = texture2D(uSampler, vec2(texx + texdx, texy				 )).r;
		float u_ylo = texture2D(uSampler, vec2(texx		 		 , texy - texdy)).r;
		float u_yhi = texture2D(uSampler, vec2(texx		 		 , texy + texdy)).r;
		
		float dx2 = dx * dx;
		float dy2 = dy * dy;
		
		float value = (2.0 * dx2 * dy2 * f(x, y, t) - dy2 * (u_xlo + u_xhi) - dx2 * (u_ylo + u_yhi)) / (-2.0 * (dx2 + dy2));
		
		//float value = (u_xlo + u_xhi + u_ylo + u_yhi - f(x, y, t) * 2.0 * dx * dx) * 0.25;
		
		gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
	}
	//*/
}