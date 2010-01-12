uniform mat4 modelviewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 vTexCoord;
attribute vec4 position;

varying vec2 v_texCoord;

void main() {
	gl_Position = projectionMatrix * position;
	v_texCoord = vTexCoord.st;
}