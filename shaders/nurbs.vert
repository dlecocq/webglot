uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

uniform sampler2D knotsTexture;
uniform sampler2D cpsTexture;

uniform float t;
uniform int cpCount;
uniform int knotCount;

float cpEps = 0.5 / float(cpCount);
float knEps = 0.5 / float(knotCount);

attribute vec4 position;
attribute float l;

varying float u;

int n = DEGREE;

vec4  ds[DEGREE + 1];
float as[DEGREE + 1];
float us[DEGREE + 1];

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
	for (int i = li - n; i <= li; ++i) {
		ds[i] = texture2D(knotsTexture, vec2(float(i) / float(cpCount) + cpEps, 0));
	}
	//*/
	
	//*
	// Grab all the u's early on
	for (int i = li + 1; i <= li + n + 1; ++i) {
		us[i] = texture2D(knotsTexture, vec2(float(i) / float(knotCount) + knEps, 0)).r;
	}
	//*/
	
	// For all degrees, starting with the lowest...
	for (int k = 1; k <= n; ++k) {
		// For all knots necessary
		// It's important to begin with i and move left
		// because of data dependencies
		for (int i = li; i >= li - n + k; --i) {
			as[i] = (u - us[i]) / (us[i + n + 1 - k] - us[i]);
			ds[i] = (1.0 - as[i]) * ds[i - 1] + as[i] * ds[i];
		}
	}
	
	vec4 knotsValue = texture2D(knotsTexture, vec2(u, 0.0));
	vec4 cpsValue   = texture2D(cpsTexture  , vec2(u, 0.0));
	
	result.x = l;
	
	// COORDINATE_TRANSFORMATION
	
	gl_Position = projectionMatrix * modelviewMatrix * result;
}