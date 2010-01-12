varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float t;

uniform float width;
uniform float height;

float texdy = 1.0 / (height - 1.0);
float texdx = 1.0 / (width  - 1.0);

float dy = 2.0 / (height - 1.0);
float dx = 2.0 / (width  - 1.0);

const float alpha = 1.0;

//const float omega = 120.0;

// USER_PARAMETERS

float uxx(float x, float y, float t) {
	//return -2.0 * (1.0 + y) * (1.0 - y);
	return -omega * omega * sin(omega * x);
}

float uyy(float x, float y, float t) {
	//return -2.0 * (1.0 + x) * (1.0 - x);
	return -omega * omega * cos(omega * y);
}

float f(float x, float y, float t) {
	return uxx(x, y, t) + uyy(x, y, t);
}

float u_f(float x, float y, float t) {
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
		
		//* Blur kernel
		//gl_FragColor = 0.2 * (left + right + down + up + self);
		//*/
		
		float dx2 = dx * dx;
		float dy2 = dy * dy;
		
		float r = (dy2 * (self.g +  left.g) + dx2 * (self.b +   up.b) - 2.0 * dx2 * dy2 * f(x - 0.5 * dx, y + 0.5 * dy, t)) / (2.0 * (dx2 + dy2));
		float g = (dy2 * (self.r + right.r) + dx2 * (self.a +   up.a) - 2.0 * dx2 * dy2 * f(x + 0.5 * dx, y + 0.5 * dy, t)) / (2.0 * (dx2 + dy2));
		float b = (dy2 * (self.a +  left.a) + dx2 * (self.r + down.r) - 2.0 * dx2 * dy2 * f(x - 0.5 * dx, y - 0.5 * dy, t)) / (2.0 * (dx2 + dy2));
		float a = (dy2 * (self.b + right.b) + dx2 * (self.g + down.g) - 2.0 * dx2 * dy2 * f(x + 0.5 * dx, y - 0.5 * dy, t)) / (2.0 * (dx2 + dy2));
		
		gl_FragColor = vec4(r, g, b, a);
	}
}