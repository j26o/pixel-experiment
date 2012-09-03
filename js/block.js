var Block = function ( context, x, y, grid, colour ) {
	this.neighbours = Array();
	// this.colour = getColour();
	this.colour = colour;
	this.ink = 0;
	this.x = x;
	this.y = y;
	this.ctx = context;
	this.grid = grid;
	this.dcolour;
	this.speed = 1;
	this.hitrange = 2;
	this.randomhit = false;
	this.coldec = 10;

	this.setNeighbours = function( neighbours ) {
		this.neighbours = neighbours;
	}
	
	this.setColour = function( newCol ) {
		if(this.dcolour==undefined){
			this.dcolour = new Colour;		
			this.dcolour.r = this.colour.r;
			this.dcolour.g = this.colour.g;
			this.dcolour.b = this.colour.b;		
		}
		
		this.colour.r = newCol.r;
		this.colour.g = newCol.g;
		this.colour.b = newCol.b;
	}
	
	this.revertColour = function() {
		if(this.dcolour !== undefined){
			if(this.colour.r > this.dcolour.r){
				this.colour.r  = this.colour.r - this.speed;
				if(this.colour.r < this.dcolour.r)this.colour.r = this.dcolour.r;
			} else if(this.colour.r < this.dcolour.r){
				this.colour.r = this.colour.r + this.speed;
				if(this.colour.r > this.dcolour.r)this.colour.r = this.dcolour.r;
			} else{
				this.colour.r = this.dcolour.r;
			}
					
			if(this.colour.g > this.dcolour.g){
				this.colour.g = this.colour.g - this.speed;
				if(this.colour.g < this.dcolour.g)this.colour.g = this.dcolour.g;
			} else if(this.colour.g < this.dcolour.g){
				this.colour.g = this.colour.g + this.speed;
				if(this.colour.g > this.dcolour.g)this.colour.g = this.dcolour.g;
			} else{
				this.colour.g = this.dcolour.g;
			}
			
			
			if(this.colour.b > this.dcolour.b){
				this.colour.b = this.colour.b - this.speed;
				if(this.colour.b < this.dcolour.b)this.colour.b = this.dcolour.b;
			} else if(this.colour.b < this.dcolour.b){
				this.colour.b = this.colour.b + this.speed;
				if(this.colour.b > this.dcolour.b)this.colour.b = this.dcolour.b;
			} else{
				this.colour.b = this.dcolour.b;
			}
			
		}
		
	}

	this.hit = function(hitColour) {
		this.setColour(hitColour);
		this.colorSpread(this.hitrange, hitColour);
	}
	
	this.colorSpread = function(range, prevc){
		for (var i = 0; i < this.neighbours.length; i ++) {
			
			var hc = new Colour;
			hc.r = prevc.r - this.coldec;
			hc.g = prevc.g - this.coldec;
			hc.b = prevc.b - this.coldec;
			
			var curNeighbour = this.neighbours[i];
			var nc = curNeighbour.colour;
			
			if(hc.r < prevc.r && hc.g < prevc.g && hc.b < prevc.b && nc.r < prevc.r && nc.g < prevc.g && nc.b < prevc.b){
				if(this.randomhit == true || this.randomhit == 'true'){
					var b = Math.round(Math.random())==1 ? true : false;
					if (b)curNeighbour.setColour(hc);
				}else{
					curNeighbour.setColour(hc);
				}
			}
			
			if(range > 1){				
				if(this.randomhit == true || this.randomhit == 'true'){
					var b = Math.round(Math.random())==1 ? true : false;
					if (b)curNeighbour.colorSpread((range-1), hc);
				}else{
					curNeighbour.colorSpread((range-1), hc);
				}
			}
		}
	}
	
	this.randomrange = function(mx, mn) {
     	return Math.floor(Math.random() * (mx - mn) + mn);
	}
	
	
}