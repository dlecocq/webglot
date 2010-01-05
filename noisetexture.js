/* http://learningwebgl.com/blog/?p=507
 */
function noisetexture(context, scr) {
	
	this.texture = null;
	this.image	 = null;
	
	this.gl			 = context;
	this.scr     = scr;

	this.initialize = function() {		
		this.texture = this.gl.createTexture();
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

		var pixels = new WebGLFloatArray(scr.width * scr.height * 4);
		var count = scr.width * scr.height * 4;
		for (var i = 0; i < count; i += 4) {
			pixels[i] = Math.floor(Math.random() * 256);
		}
		this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, scr.width, scr.height, 0, this.gl.RGBA, this.gl.FLOAT, pixels);
		
		this.gl.enable(this.gl.TEXTURE_2D);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
		this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
		this.gl.bindTexture(this.gl.TEXTURE_2D, null);
	}
	
	this.bind = function() {
		this.gl.enable(this.gl.TEXTURE_2D);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
	}
	
	this.initialize();
	
	return this.texture;
}