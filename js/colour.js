var Colour = function( r, g, b ) {
	this.r = parseInt(r);
	this.g = parseInt(g);
	this.b = parseInt(b);

	this.add = function( num ) {
		this.r += num;
		this.g += num;
		this.b += num;
		if (this.r > 255) r = 255;
		if (this.g > 255) g = 255;
		if (this.b > 255) b = 255;
	}

	this.toRgba = function( alpha ) {
		return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + alpha + ')';
	}
}
