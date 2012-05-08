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

uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

uniform float dx;
uniform float dy;
uniform float scale;

// USER_PARAMETERS

attribute vec4 position;
attribute vec2 aTextureCoord;

varying float magnitude;

uniform float t;

varying vec2 vTextureCoord;

const float h = 0.001;
const float dt = 0.01;

float function(float x, float y) {
	return USER_FUNCTION;
}

void main() {
	float x = (position.x + dx) * scale;
	float y = (position.y + dy) * scale;
	
	vec2 hi = vec2(function(x + dt, y), function(x, y + dt));
	vec2 lo = vec2(function(x - dt, y), function(x, y - dt));
	
	vec2 d = (hi - lo) / (2.0 * dt);
	
	magnitude = length(d);

	/*
	vec4 result = vec4(x + h * d.x, y + h * d.y, 0.0, 1.0);
	gl_Position = u_projectionMatrix * result;
	vTextureCoord = aTextureCoord;// - 5.0 * h * d;
	//*/
	
	//*
	gl_Position = projectionMatrix * position;
	vTextureCoord = aTextureCoord - h * normalize(d);
	//*/
}