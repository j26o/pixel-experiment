$(document).ready(function(){
	pixelCanvas = $('#pixelCanvas');
	canvasContext = document.getElementById('pixelCanvas').getContext('2d');
	
	gradCv = $('#gradCv');
	gradCtx = document.getElementById('gradCv').getContext('2d');
	
	pixelsize = 20;
	row = new Array;
	blocks = new Array;
	blocksSequence = new Array;
	
	hitColour = new Colour(243, 112, 100);
	colToUse = new Colour(243, 112, 83);
	baseColour = new Colour( 55, 0, 0 );
	
	spirals = Array();
	lastX = -1; // Last hit coords
	lastY = -1;
	colourMode = true;
	animators = Array();
	message = '';
	originX = 0;
	originY = 0;
	
	initControls();
	
	initCanvas();
	
	resizeCanvas();
	
	$(window).resize(resizeCanvas);
	
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       || 
			  window.webkitRequestAnimationFrame || 
			  window.mozRequestAnimationFrame    || 
			  window.oRequestAnimationFrame      || 
			  window.msRequestAnimationFrame     || 
			  function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			  };
	})();
	
	tick();
});

function initCanvas(){
	gradCv.attr("width", 1);
	gradCv.attr("height", $(window).get(0).innerHeight);
	
	initGradient(colToUse,baseColour,canvasContext);
	
	pixelCanvas.attr("width", $(window).get(0).innerWidth);
	pixelCanvas.attr("height", $(window).get(0).innerHeight);
	
	rows = Math.ceil($(window).get(0).innerWidth/pixelsize);
	cols = Math.ceil($(window).get(0).innerWidth/pixelsize);
	
	grid = new Grid(rows, cols, canvasContext, gradCtx);
	grid.pixelsize = pixelsize;
	grid.init();

	pixelCanvas.mousemove( function(e) {
		var x = e.pageX - $(this).offset().left;
		var y = e.pageY - $(this).offset().top;
		
		x = Math.ceil( x / grid.totalBlockWidth );
		y = Math.ceil( y / grid.totalBlockWidth );

		// Check we're not out of bounds
		if (x > (grid.cols - 1) || y > (grid.rows -1)) return;
		if (x < 0 || y < 0) return;
		
		if ( lastX != x || lastY != y ){
			grid.blocks[y][x].hit(hitColour);
			lastX = x;
			lastY = y;
		}	
	});
	
	pixelCanvas.click(function(e) {
		var x = e.pageX - $(this).offset().left;
		var y = e.pageY - $(this).offset().top;

		x = Math.floor( x / grid.totalBlockWidth );
		y = Math.floor( y / grid.totalBlockWidth );

		// Check we're not out of bounds
		if (x > (grid.cols - 1) || y > (grid.rows -1)) return;
		if (x < 0 || y < 0) return;

		grid.blocks[y][x].hit(hitColour);
	});
	
}

function initControls(){
	$('#random-range').slider({
		range: true,
		min: -30,
		max: 30,
		values: [ 0, 10 ],
		slide: function( event, ui ) {
			$( "#randrange" ).val(ui.values[ 0 ] + " : " + ui.values[ 1 ] );
			grid.minr = ui.values[ 0 ];
			grid.maxr = ui.values[ 1 ];
			
			grid.init();
		}
	});	
	$("#randrange").val($('#random-range').slider('values', 0) + ' - ' + $('#random-range').slider('values', 1));
	
	$('#hit-range').slider({
		min: 1,
		max: 10,
		value: 2,
		slide: function( event, ui ) {
			$( "#hitrange" ).val(ui.value);
			grid.hitamt = ui.value;
			grid.assignHitrange();
		}
	});
	$("#hitrange").val($('#hit-range').slider('value'));	
	
	$('#fade-speed').slider({
		min: 1,
		max: 10,
		value: 2,
		slide: function( event, ui ) {
			$( "#fadespeed" ).val(ui.value);
			grid.blockSpeed(ui.value);
		}
	});	
	$("#fadespeed").val($('#fade-speed').slider('value'));	
	
	
	$('#randhit').click(function(){
		if($(this).is(':checked')) { grid.randomHit(true) } else { grid.randomHit(false) }
	});
	
	$('#color_t').bind('colorpicked', function () {
		$('#t-color').val($(this).val());
		
		var tcolor = strtoRGB($(this).val());
		colToUse = new Colour(tcolor[0], tcolor[1], tcolor[2]);
		
		initCanvas();
		grid.init();
    });
	$('#color_b').bind('colorpicked', function () {
		$('#b-color').val($(this).val());
		
		var bcolor = strtoRGB($(this).val());
		baseColour = new Colour(bcolor[0], bcolor[1], bcolor[2]);
		
		initCanvas();
		grid.init();
    });
	$('#color_h').bind('colorpicked', function () {
		$('#h-color').val($(this).val());
		var hcolor = strtoRGB($(this).val());
		hitColour = new Colour(hcolor[0], hcolor[1], hcolor[2]);
		
    });
}

function strtoRGB(col){
	var ncol = col.replace('rgb(','');
	ncol = ncol.replace(')','');
	
	return ncol.split(',');
}

function tick() {
	canvasContext.clearRect(0, 0, $(window).get(0).innerWidth, $(window).get(0).innerHeight);
	canvasContext.save();
	
	update();
	draw();
	
	canvasContext.restore();
	
	requestAnimFrame(tick, grid);
}

function update(){
	for (var i = 0; i < grid.blocksSequence.length; i ++) {
		 grid.blocksSequence[i].revertColour();
	}
}

function draw(){
	for (var i = 0; i < grid.blocksSequence.length; i ++) {
		canvasContext.fillStyle = grid.blocksSequence[i].colour.toRgba(1);
		//canvasContext.save();
		canvasContext.fillRect ( grid.blocksSequence[i].x*grid.blockWidth, grid.blocksSequence[i].y*grid.blockWidth, grid.blockWidth , grid.blockWidth );
		//canvasContext.restore();
	 }
}

function initGradient(c1,c2){
	var lingrad = gradCtx.createLinearGradient(0,0,0,$(window).get(0).innerHeight);
    lingrad.addColorStop(0, c1.toRgba(1));
    lingrad.addColorStop(1, c2.toRgba(1));
	
	gradCtx.fillStyle = lingrad;
	gradCtx.fillRect(0, 0, 1, $(window).get(0).innerHeight);
}

function resizeCanvas() {
	canvasContext.clearRect(0, 0, $(window).get(0).innerWidth, $(window).get(0).innerHeight);
	
	pixelCanvas.attr("width", $(window).get(0).innerWidth);
	pixelCanvas.attr("height", $(window).get(0).innerHeight);
	
	rows = Math.ceil($(window).get(0).innerWidth/pixelsize);
	cols = Math.ceil($(window).get(0).innerWidth/pixelsize);
	if(grid!=undefined){
		grid.rows = rows;
		grid.cols = cols;
		grid.init();
	}	
};

function rand ( n,m ){
  return ( Math.floor ( Math.random ( ) * n + m) );
}

