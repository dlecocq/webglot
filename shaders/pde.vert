uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;

attribute vec4 vPosition;
attribute vec2 aTextureCoord;

uniform float t;

varying vec2 vTextureCoord;

void main() {
	
	gl_Position = u_projectionMatrix * vPosition;
	
	vTextureCoord = aTextureCoord;
}