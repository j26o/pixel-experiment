var Grid = function (rows, cols, ctx, gctx) {
	this.rows = rows;
	this.cols = cols;
	this.blockWidth = pixelsize;
	this.blockSpacing = 0;
	this.blocks = Array();
	this.blocksSequence = Array();
	this.minr = 0;
	this.maxr = 10;
	
	this.pixelsize = 10;
	
	this.canvasContext = ctx;
	this.gradCtx = gctx;
	
	this.hitamt  = 2;

	// Do some maths to speed up the calculations later
	this.totalBlockWidth = this.blockWidth + this.blockSpacing;
	this.halfBlockWidth = Math.floor( this.totalBlockWidth / 2 );

	this.init = function() {
		// initialise the blocks
		this.blocks = new Array();
		this.blocksSequence = new Array();
		
		for (rows = 0; rows < this.rows; rows ++) {
			row = new Array;
			
			for (cols = 0; cols < this.cols; cols ++ ) {
				var rand = this.randomrange(rows+this.minr, rows-this.maxr);
				if (rand < 0) rand = 0;
				if(rand > this.rows) rand = this.rows;
				//var imageData = gradCtx.getImageData(0, rows*pixelsize, 1, 1);
				var imageData = this.gradCtx.getImageData(0, rand*pixelsize, 1, 1);
				var pixel = imageData.data;
				var pixelColour = new Colour(pixel[0], pixel[1], pixel[2]);
				row[cols] = new Block(canvasContext, cols, rows, this, pixelColour);
			}
			this.blocks[rows] = row;
		}

		this.assignHitrange();
		
		// Loop through all the blocks and assign neighbours
		for (rows = 0; rows < this.rows; rows ++) {
			for (cols = 0; cols < this.cols; cols ++ ) {
				neighbours = new Array();
				
				if (cols < (this.cols - 1)) {
					neighbours.push( this.blocks[rows][cols + 1] );
				}
				if (rows < (this.rows - 1)) {
					neighbours.push( this.blocks[rows + 1][cols] );
				}
				if (cols > 0) {
					neighbours.push( this.blocks[rows][cols - 1] );
				}
				if (rows > 0) {
					neighbours.push( this.blocks[rows - 1][cols] );
				}
				
				this.blocks[rows][cols].setNeighbours( neighbours );
				this.blocksSequence.push( this.blocks[rows][cols] );
			}
		}
	}
	
	this.randomrange = function(mx, mn) {
     	return Math.floor(Math.random() * (mx - mn) + mn);
	}
	
	this.blockSpeed = function(num){
		for (var i = 0; i < grid.blocksSequence.length; i ++) {
			grid.blocksSequence[i].speed = num;
		}
	}
	
	this.randomHit = function(val) {
		for (var i = 0; i < grid.blocksSequence.length; i ++) {
			grid.blocksSequence[i].randomhit = val;
		}
	}
	
	this.assignHitrange = function() {
		for (var i = 0; i < grid.blocksSequence.length; i ++) {
			grid.blocksSequence[i].hitrange = this.hitamt;
		}
	}
}