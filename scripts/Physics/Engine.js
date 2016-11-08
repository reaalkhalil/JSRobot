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

	prototype.getTime = function(){
		return parseInt(__(this).timestep);
	};

	__private.update = function(){
		//needs to change
		// this calls bodies' update function, that then sends an instance of the body to
		// the behaviour object which acts on it, if it's an agent, a robot behaviour calls its step fn.
		// the step fn. then calls protected functions that move robots with constraints imposed.
		// There is then no need for a public move fn. in a body. behaviours are sent the entire body. 
		//delete objects if toBeDeleted
		for(var i in __(this).world){
			var obj = __(this).world[i];
			if(!obj.isFixed()){
				obj.update();
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
		for(var i in __(this).world){
			__(this).world[i].render();
		}
	};

	prototype.start = function(){
		if(__(this).started === true){return;}
		var that = __(this);
		__(this).started = false;
		var tickerf = function(){that.ticker();};
		setInterval(tickerf,1000/fps);
	};

	// this should be private... it's okay if someone makes a new object, as long as it's not
		// added to the engine it cant do anything really
	prototype.add = function(sprite){
		__(this).world.push(sprite);
	};

});
