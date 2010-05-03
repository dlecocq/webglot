uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D knotsTexture;
uniform sampler2D cpsTexture;

uniform float t;
uniform int cpCount;
uniform int knotCount;

uniform float scale;

float cpEps = 0.5 / float(cpCount);
float knEps = 0.5 / float(knotCount);

attribute vec4 position;
attribute float l;

varying float u;

int n = DEGREE;

vec4  ds[20];
float as[20];
float us[20];

// USER_PARAMETERS

vec4 function(float s) {
	return vec4(USER_FUNCTION, s, 0.0, 1.0);
}

void main() {
	vec4 result = function(position.x);
	
	u = position.x;
	
	int li = int(l);
	
	//*
	// Grab all the control points early on
	for (int i = 0; i <= n; ++i) {
		ds[i] = texture2D(knotsTexture, vec2(float(li - n + i) / float(cpCount) + cpEps, 0));
	}
	//*/
	
	//*
	// Grab all the u's early on
	for (int i = 0; i < 2 * n; ++i) {
		us[i] = texture2D(knotsTexture, vec2(float(li - n + 1 + i) / float(knotCount) + knEps, 0)).r;
	}
	//*/
	
	// For all degrees, starting with the lowest...
	for (int k = 1; k <= n; ++k) {
		// For all knots necessary
		// It's important to begin with i and move left
		// because of data dependencies
		for (int i = n; i >= k; --i) {
			// Watch out for divide-by-zeros
			// as[i-1] = (u - us[i-1]) / (us[i + n - k] - us[i -1]);
			as[i-1] = us[i + n - k] - us[i-1];
			if (as[i-1] != 0.0) {
				as[i-1] = (u - us[i-1]) / as[i-1];
			}
			ds[i] = (1.0 - as[i - 1]) * ds[i - 1] + as[i - 1] * ds[i];
		}
	}
	
	vec4 knotsValue = texture2D(knotsTexture, vec2(u, 0.0));
	vec4 cpsValue   = texture2D(cpsTexture  , vec2(u, 0.0));
	
	result.y = ds[n].x;
	result.xy /= scale;
	//result.x = ds[n].y;
	//result.x = l;
	
	// COORDINATE_TRANSFORMATION
	
	gl_Position = projectionMatrix * modelviewMatrix * result;
}