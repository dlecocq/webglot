/* Copyright (c) 2009-2010 King Abdullah University of Science and Technology
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float t;

uniform float width;
uniform float height;

//uniform float factor;

float texdy = 1.0 / (height);
float texdx = 1.0 / (width );

float dy = 1.0 / (height);
float dx = 1.0 / (width );

const float alpha = 1.0;

const float omega = 120.0;

// USER_PARAMETERS

float uxx(float x, float y, float t) {
	//return -2.0 * (1.0 + y) * (1.0 - y);
	//return -omega * omega * sin(omega * (abs(x + y * y * y) * sin(x)));
	//return -omega * omega * sin(omega * (abs(x + pow(y, 3.0)) + sin(x)));
	return -omega * omega * sin(omega * x);
	//return 1.0 + y + 2.0 * x * y + y * y + 7.0 * x;
}

float uyy(float x, float y, float t) {
	//return -2.0 * (1.0 + x) * (1.0 - x);
	//return -omega * omega * cos(omega * (abs(y + x * x * x) * cos(x)));
	return -omega * omega * cos(omega * y);
	//return x + x * x + x * 2.0 * y + 1.0 + 7.0 * y;
}

float f(float x, float y, float t) {
	return uxx(x, y, t) + uyy(x, y, t);
}

float u_f(float x, float y, float t) {
	//return sin(omega * x) + cos(omega * y);
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
		
		float dx2 = (dx * dx);
		float dy2 = (dy * dy);
		
		//*
		// Forget this tiny, pathetic kernel.
		float r = (dy2 * (self.g +  left.g) + dx2 * (self.b +   up.b) - 2.0 * dx2 * dy2 * f(x - 0.5 * dx, y + 0.5 * dy, t)) / (2.0 * (dx2 + dy2));
		float g = (dy2 * (self.r + right.r) + dx2 * (self.a +   up.a) - 2.0 * dx2 * dy2 * f(x + 0.5 * dx, y + 0.5 * dy, t)) / (2.0 * (dx2 + dy2));
		float b = (dy2 * (self.a +  left.a) + dx2 * (self.r + down.r) - 2.0 * dx2 * dy2 * f(x - 0.5 * dx, y - 0.5 * dy, t)) / (2.0 * (dx2 + dy2));
		float a = (dy2 * (self.b + right.b) + dx2 * (self.g + down.g) - 2.0 * dx2 * dy2 * f(x + 0.5 * dx, y - 0.5 * dy, t)) / (2.0 * (dx2 + dy2));
		//*/
		
		/*
		float r = ((self.g +  left.g) * dx2i + (self.b +   up.b) * dy2i - f(x - 0.5 * dx, y + 0.5 * dy, t)) / (dx2i + dy2i);
		float g = ((self.r + right.r) * dx2i + (self.a +   up.a) * dy2i - f(x + 0.5 * dx, y + 0.5 * dy, t)) / (dx2i + dy2i);
		float b = ((self.a +  left.a) * dx2i + (self.r + down.r) * dy2i - f(x - 0.5 * dx, y - 0.5 * dy, t)) / (dx2i + dy2i);
		float a = ((self.b + right.b) * dx2i + (self.g + down.g) * dy2i - f(x + 0.5 * dx, y - 0.5 * dy, t)) / (dx2i + dy2i);
		//*/
		
		/*
		// Feast your eyes upon a 9-point stencil!
		float r = (dy2 * (left.r - 16.0 * left.g - 16.0 * self.g  + right.r) + dx2 * (up.r - 16.0 * up.b   - 16.0 * self.b + down.r) + 12.0 * dx2 * dy2 * f(x - 0.5 * dx, y + 0.5 * dy, t)) / (-30.0 * (dx2 + dy2));
		float g = (dy2 * (left.g - 16.0 * self.r - 16.0 * right.r + right.g) + dx2 * (up.g - 16.0 * up.a   - 16.0 * self.a + down.g) + 12.0 * dx2 * dy2 * f(x + 0.5 * dx, y + 0.5 * dy, t)) / (-30.0 * (dx2 + dy2));
		float b = (dy2 * (left.b - 16.0 * left.a - 16.0 * self.a  + right.b) + dx2 * (up.b - 16.0 * self.r - 16.0 * down.r + down.b) + 12.0 * dx2 * dy2 * f(x - 0.5 * dx, y - 0.5 * dy, t)) / (-30.0 * (dx2 + dy2));
		float a = (dy2 * (left.a - 16.0 * self.b - 16.0 * right.b + right.a) + dx2 * (up.a - 16.0 * self.g - 16.0 * down.g + down.a) + 12.0 * dx2 * dy2 * f(x + 0.5 * dx, y - 0.5 * dy, t)) / (-30.0 * (dx2 + dy2));
		//*/
		
		//gl_FragColor = vec4(r, g, b, a);
		
		/*
		//vec4 a is left;
		vec4 a = vec4(left.g , self.r , left.a , self.b );
		vec4 b = vec4(self.g , right.r, self.a , right.b);
		//vec4 d is right
		//vec4 e is up
		vec4 c = vec4(up.b, up.a, self.r, self.g);
		vec4 d = vec4(self.b, self.a, down.r, down.g);
		//vec4 h is down
		
		gl_FragColor = (dy2 * (left - 16.0 * a - 16.0 * b  + right) + dx2 * (up - 16.0 * c   - 16.0 * d + down) + 12.0 * dx2 * dy2 * f(x - 0.5 * dx, y + 0.5 * dy, t)) / (-30.0 * (dx2 + dy2));
		//*/
	}
}