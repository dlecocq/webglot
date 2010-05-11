varying vec2 v_texCoord;
uniform float t;

uniform float dx;
uniform float dy;

uniform float scale;

const float PI = 3.14159265;

// USER_PARAMETERS

void main () {

	float x = scale * (v_texCoord.x + dx);
	float y = scale * (v_texCoord.y + dy);
	
	/* POLAR
	float tmp = x;
	x = sqrt(x * x + y * y);
	if (tmp > 0.0) {
		if (y >= 0.0) {
			y = atan(y / tmp);
		} else {
			y = atan(y / tmp) + (2.0 * PI);
		}
	} else {
		y = atan(y / tmp) + PI;
	}
	//*/
	
	float value = USER_FUNCTION;
	value = (value + 1.0) / 2.0;

	value = 1.0 - value;
	float red = 1.0;
	float green = 1.0;
	float blue = 0.0;

	if (value > 0.8) {
		red = (value - 0.8) * 5.0;
		green = 0.0;
		blue = 1.0;
	} else if (value > 0.6) {
		red = 0.0;
		green = (0.8 - value) * 5.0;
		blue = 1.0;
	} else if (value > 0.4) {
		red = (0.6 - value) * 5.0;
		green = 1.0;
		blue = (value - 0.4) * 5.0;
	} else if (value > 0.2) {
		red = 1.0;
		green = 0.5 + (value - 0.2) * 2.5;
	} else {
		red = 1.0;
		green = (value) * 2.5;
	}

	gl_FragColor = vec4(red, green, blue, 0.7);
}