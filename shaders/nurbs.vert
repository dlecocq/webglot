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

uniform sampler2D knotsTexture;
uniform sampler2D cpsTexture;

uniform float t;
uniform int cpCount;
uniform int knotCount;

uniform float scale;

float cpEps = 1.0 / float(cpCount + 1);
float knEps = 1.0 / float(knotCount + 1);

attribute vec4 position;
attribute float l;

varying float u;

vec4  ds[20];
float as[20];
float us[20];

// USER_PARAMETERS

vec4 function(float s) {
	//return vec4(USER_FUNCTION, (1.0 - (0.5 * s / 0.5)) * ((1.0 - (0.5 * s / 0.5)) * 1.0 + (0.5 * s / 0.5) * 2.0) + (0.5 * s / 0.5) * ((1.0 - 0.5 * s) * 2.0 + 0.5 * s * 0.0), 0.0, 1.0);
	return vec4(0.0, s, 0.0, 1.0);
}

void main() {
	vec4 result = function(position.x);
	
	u = position.x;
	
	int n = DEGREE;

	int li = int(l);
	
	//*
	// Grab all the control points early on
	for (int i = 0; i <= DEGREE; ++i) {
		ds[i] = texture2D(cpsTexture, vec2(float(li - n + i) / float(cpCount + 1) + cpEps, 0));
		ds[i].xyz *= ds[i].w;
	}
	//*/
	
	//result.x = ds[0].xy;
	
	//*
	// Grab all the u's early on
	for (int i = 0; i < 2 * DEGREE; ++i) {
		us[i] = texture2D(knotsTexture, vec2(float(li - n + 1 + i) / float(knotCount + 1) + knEps, 0)).r;
	}
	//*/
	
	// For all degrees, starting with the lowest...
	for (int k = 1; k <= DEGREE; ++k) {
		// For all knots necessary
		// It's important to begin with i and move left
		// because of data dependencies
		for (int i = DEGREE; i >= 0; --i) {
			if (i < k)
				continue;
			// Watch out for divide-by-zeros
			as[i-1] = (u - us[i-1]) / (us[i + DEGREE - k] - us[i -1]);
			/*
			as[i-1] = us[i + n - k] - us[i-1];
			if (as[i-1] != 0.0) {
				as[i-1] = (u - us[i-1]) / as[i-1];
			}
			//*/
			ds[i] = (1.0 - as[i - 1]) * ds[i - 1] + as[i - 1] * ds[i];
		}
	}
	
	vec4 knotsValue = texture2D(knotsTexture, vec2(u, 0.0));
	vec4 cpsValue   = texture2D(cpsTexture  , vec2(u, 0.0));
	
	//result.xy = cpsValue.xy;
	//result.x = knotsValue.r;
	
	result.xy = ds[DEGREE].xy / ds[DEGREE].w;
	result.xy /= scale;
	//result.x = l;
	
	// COORDINATE_TRANSFORMATION
	
	gl_Position = projectionMatrix * modelviewMatrix * result;
}