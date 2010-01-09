varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float t;

const float width = 1264.0;
const float height = 652.0;

const float texdy = 1.0 / (height - 1.0);
const float texdx = 1.0 / (width  - 1.0);

const float dy = 2.0 * texdx;
const float dx = 2.0 * texdy;

const float alpha = 1.0;

const float omega = 60.0;

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
	
	float texx = coord.x;
	float texy = coord.y;
	
	float x = coord.x * 2.0 - 1.0;
	float y = coord.y * 2.0 - 1.0;
	
	if (texx <= texdx) {
		x = u_f(x, y, t);
		gl_FragColor = vec4(x, x, x, x);	
	} else if (texx >= (1.0 - texdx)) {
		// If a pixel is on the x boundary
		x = u_f(x, y, t);
		gl_FragColor = vec4(x, x, x, x);
	} else if (texy <= texdy) {
		x = u_f(x, y, t);
		gl_FragColor = vec4(x, x, x, x);
	} else if (texy >= (1.0 - texdy)) {
		// If a pixel is on the y boundary
		x = u_f(x, y, t);
		gl_FragColor = vec4(x, x, x, x);
	} else {
		vec4 left  = texture2D(uSampler, vec2(texx - texdx, texy        ));
		vec4 right = texture2D(uSampler, vec2(texx + texdx, texy        ));
		vec4 down  = texture2D(uSampler, vec2(texx        , texy - texdy));
		vec4 up    = texture2D(uSampler, vec2(texx        , texy + texdy));
		vec4 self  = texture2D(uSampler, vec2(texx        , texy        ));
		
		float dx2 = dx * dx;
		float dy2 = dy * dy;
		
		gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		
		// This kernel is going to need to be checked
		//*
		gl_FragColor.r = (2.0 * dx2 * dy2 * f(x - 0.5 * dx, y + 0.5 * dy, t) - dy2 * (self.g +  left.g) - dx2 * (self.b +   up.b)) / (-2.0 * (dx2 * dy2));
		gl_FragColor.g = (2.0 * dx2 * dy2 * f(x + 0.5 * dx, y + 0.5 * dy, t) - dy2 * (self.r + right.r) - dx2 * (self.a +   up.a)) / (-2.0 * (dx2 * dy2));
		gl_FragColor.b = (2.0 * dx2 * dy2 * f(x - 0.5 * dx, y - 0.5 * dy, t) - dy2 * (self.a +  left.a) - dx2 * (self.r + down.r)) / (-2.0 * (dx2 * dy2));
		gl_FragColor.a = (2.0 * dx2 * dy2 * f(x + 0.5 * dx, y - 0.5 * dy, t) - dy2 * (self.b + right.b) - dx2 * (self.g + down.g)) / (-2.0 * (dx2 * dy2));
		//*/
		//gl_FragColor = vec4((2.0 * dx2 * dy2 * f(x, y, t) - dy2 * (left.r + right.r) - dx2 * (down.r + up.r)) / (-2.0 * (dx2 * dy2)), 0.0, 0.0, 1.0);
		
		//gl_FragColor.r = (2.0 * dx2 * dy2 * f(x, y, t) - dy2 * (left.r + right.r) - dx2 * (down.r + up.r)) / (-2.0 * (dx2 * dy2));
		//gl_FragColor = vec4(f(x, y, t) * 0.5 + 0.5, 0.0, 0.0, 1.0);
		
		//gl_FragColor = vec4(value, 0.0, 0.0, 1.0);
	}
	//*/
}