#version 120
#extension GL_EXT_geometry_shader4 : enable

float function(float x, float y, float t) {
	return sin(exp(x));
}
 
void main() {
	// The starting coordinate
	vec2 start;
	// The ending coordinate
	vec2 final;
	
	float dx;
	// The next coordinate
	vec2 next;
	// The mid coordinates
	vec2 mid;
	// The nearest point
	vec2 near;
	float u;
	float d2;
	
	vec2 stack[15];
	int index;
	int round;
	
	dx = (final.x - start.x) / 10.0;
	
	start = vec2(gl_PositionIn[0].x, function(gl_PositionIn[0].x, 0, 0));
	final = vec2(gl_PositionIn[1].x, function(gl_PositionIn[1].x, 0, 0));

	for (index = 0; index < 10; ++index) {
		stack[index] = vec2(final.x - index * dx, function(final.x - index * dx, 0, 0));
		//gl_Position = gl_ModelViewProjectionMatrix * vec4(stack[index].x, function(stack[index].x, 0, 0), 0.0, 1.0);
		//EmitVertex();
	}
	
	index = 9;
	round = 9;
	
	gl_Position = gl_ModelViewProjectionMatrix * vec4(start.x, start.y, 0.0, 1.0);
	EmitVertex();
	
	while (index != 0) {
		next = stack[index];
	
		mid.x = (next.x + start.x) / 2.0;
		mid.y = function(mid.x, 0, 0);

		u = ((dx / 2.0)*dx + (mid.y - start.y)*(next.y - start.y)) / (dx * dx + (next.y - start.y) * (next.y - start.y));

		near.x = start.x + u * dx;
		near.y = start.y + u * (next.y - start.y);

		d2 = (mid.x - near.x) * (mid.x - near.x) + (mid.y - near.y) * (mid.y - near.y);
		
		if (d2 > 0.0001) {
			if (index - round > 5) {
				gl_Position = gl_ModelViewProjectionMatrix * vec4(mid.x, mid.y, 0.0, 1.0);
				EmitVertex();
				//gl_Position = gl_ModelViewProjectionMatrix * vec4(next.x, next.y, 0.0, 1.0);
				//EmitVertex();
				start = stack[index];
				index = index - 1;
			} else {
				index = index + 1;
				stack[index] = mid;
			}
		} else {
			if (index > round) {
				gl_Position = gl_ModelViewProjectionMatrix * vec4(next.x, next.y, 0.0, 1.0);
				EmitVertex();
			}
			start = stack[index];
			index = index - 1;
		}
		round = round - 1;
	}

	gl_Position = gl_ModelViewProjectionMatrix * vec4(final.x, final.y, 0.0, 1.0);
	EmitVertex();
	
	EndPrimitive();
	
}
