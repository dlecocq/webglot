uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;

attribute vec4 vTexCoord;
attribute vec4 vPosition;

varying vec2 v_texCoord;

void main() {
	gl_Position = u_projectionMatrix * u_modelViewMatrix * vPosition;
	v_texCoord = vTexCoord.st;
}