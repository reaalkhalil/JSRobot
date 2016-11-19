define(["mozart", 'Builder'],function (mozart, Builder) {

var Engine = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function() {
		__(this).world = [];
		__(this).timestep = 0;
		__(this).started = false;
		__(this).properties = {x:0, y:0, width: 800, height: 500};
		__(this).build();
	};

	__private.ticker = function(){
		__(this).timestep++;
		__(this).update();
	};

	prototype.getTime = function(){
		return parseInt(__(this).timestep);
	};

	prototype.worldData = function(bodyPubl){
		// specify object to this function to remove it from the results
		var data = [];
		for(var i in __(this).world){
			var worldobject = __(this).world[i];
			if(bodyPubl == worldobject){continue;}
			var dataobject = {};
			dataobject.k = __(this).world[i].getK();
			dataobject.box = __(this).world[i].getBox();
			dataobject.mass = __(this).world[i].getMass();
			dataobject.type = __(this).world[i].getType();
			data.push(dataobject);
		}
		return data;
	};

	__private.exportWorld = function(){
		var coins = [];
		var batteries = [];
		var walls = [];
		for(var j in __(this).world){
			var o = __(this).world[j];
			var k = o.getK();
			if(o.getType() == "coin"){
				coins.push({x: k.x, y: k.y, vx: k.vx, vy: k.vy, ax: k.ax, ay: k.ay});
			}
			if(o.getType() == "battery"){
				batteries.push({x: k.x, y: k.y, vx: k.vx, vy: k.vy, ax: k.ax, ay: k.ay});
			}
			if(o.getType() == "wall"){
				var w = o.getDimensions().w;
				var h = o.getDimensions().h;
				walls.push({x: k.x, y: k.y, vx: k.vx, vy: k.vy, ax: k.ax, ay: k.ay, w: w, h: h});
			}
		}
		Game.coins = coins;
		Game.batteries = batteries;
		Game.walls = walls;
	};

	__private.update = function(){
		__(this).exportWorld();
		for(var j in __(this).world){
			var o = __(this).world[j];
			if(o.toBeDestroyed()){
				__(this).world.splice(j,1);
				continue;
			}
		}
		collide.find(__(this), this);
		for(var i in __(this).world){
			var obj = __(this).world[i];
			if(!obj.isFixed()){ // should this condition be here?
				obj.update();
			}
		}
		__(this).render();
	};
	
	__private.render = function(){
		var p = __(this).properties;
		canvas.width = p.width;
		canvas.height = p.height;
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;
		for(var i in __(this).world){
			var o = __(this).world[i];
			var b = o.getBox();
			var k = o.getK();
			// reject objects too far from screen
			if(o.getType() == "effects" || !(k.y < -(b[2] - b[0]) + p.y ||
			k.y > p.height + (b[2] - b[0]) + p.y ||
			k.x < -(b[1] - b[3]) + p.x ||
			k.x > p.width + (b[1] - b[3]) + p.x)){
				o.render(p.x, p.y);
			}
		}
	};

	__private.start = function(){
		if(__(this).started === true){return;}
		var that = __(this);
		__(this).started = true;
		var tickerf = function(){that.ticker();};
		setInterval(tickerf,1000/fps);
	};

	__private.add = function(sprite){
		__(this).world.push(sprite);
		if(sprite.getType() == "effects"){return;}
		sprite.setEngine(__(this), this);
	};

	__private.build = function(){
		var builder = new Builder();
		__(this).builder = builder;
		builder.setEngine(__(this), this);
		builder.load(levelData);
	};

});

return Engine;
});
