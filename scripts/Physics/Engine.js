var mozart = require('mozart');

gravitatingObjects = [];

var Engine = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function() {
		__(this).world = [];
		__(this).timestep = 0;
		__(this).started = false;
	};

	__private.ticker = function(){
		__(this).timestep++;
		__(this).update();
	};

	__private.update = function(){
		//needs to change
		robot1.step();
		robot2.step();
		for(var i in __(this).world){
			var obj = __(this).world[i];
			if(!obj.fixed()){
				obj.vy += 2;
				obj.fall();
			}
		}
		__(this).render();
	};
	
	__private.render = function(){
		canvas.width = canvas.width; // clears the canvas
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;
		for(var j in elements){
			elements[j].redraw();
		}
	};

	prototype.start = function(){
		if(__(this).started === true){return;}
		var that = __(this);
		__(this).started = false;
		var tickerf = function(){that.ticker();};
		setInterval(tickerf,1000/fps);
	};

	// this should be private...
	prototype.add = function(sprite){
		__(this).world.push(sprite);
	};

});
