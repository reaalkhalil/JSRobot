define(["mozart", 'Builder'],function (mozart, Builder) {

var Engine = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function() {
		__(this).world = [];
		__(this).timestep = 0;
		__(this).started = false;
		__(this).properties = {x:0, y:0, width: 900, height: 500};
		__(this).build();
	};

	__private.ticker = function(){
		__(this).timestep++;
		__(this).update();
	};

	prototype.getTime = function(){
		return parseInt(__(this).timestep);
	};

	__private.exportWorld = function(){
		var coins = [];
		var batteries = [];
		var walls = [];
		var sparkstrips = [];
		var flag = [];
		for(var j in __(this).world){
			var o = __(this).world[j];
			var k = o.getK();
			var t = o.getType();
			if(t=="effects"){continue;}
			var w = o.getDimensions().w;
			var h = o.getDimensions().h;
			if(t == "coin"){
				coins.push({x: k.x, y: k.y, vx: k.vx, vy: k.vy, ax: k.ax, ay: k.ay});
			}
			if(t == "flag"){
				flag.push({x: k.x, y: k.y, vx: k.vx, vy: k.vy, ax: k.ax, ay: k.ay});
			}
			if(t == "battery"){
				batteries.push({x: k.x, y: k.y, vx: k.vx, vy: k.vy, ax: k.ax, ay: k.ay, w: w, h: h});
			}
			if(t == "wall"){
				walls.push({x: k.x, y: k.y, vx: k.vx, vy: k.vy, ax: k.ax, ay: k.ay, w: w, h: h});
			}
			if(t == "sparkstrip"){
				sparkstrips.push({x: k.x, y: k.y, vx: k.vx, vy: k.vy, ax: k.ax, ay: k.ay, w: w, h: h});
			}
		}
		Game.flag = flag;
		Game.coins = coins;
		Game.sparkstrips = sparkstrips;
		Game.batteries = batteries;
		Game.walls = walls;
	};

	__private.update = function(){
		__(this).exportWorld();
		for(var j in __(this).world){
			var o = __(this).world[j];
			if(o.getType() == "player"){
				var r = o.getK();
				var e = __(this).properties;
				if(r.x - e.x < 200){
					e.x = r.x - 200;
				}else if(r.x - e.x > e.width - 200){
					e.x = r.x + 200 - e.width;
				}
				if(r.y - e.y < 100){
					e.y = r.y - 100;
				}else if(r.y - e.y > e.height - 100){
					e.y = r.y + 100 - e.height;
				}
			}
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
		p.width = Math.max(450, window.innerWidth - 20);
		p.height = Math.max(300, window.innerHeight - codearea.clientHeight);
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
		builder.load(currentLevel);
	};

});

return Engine;
});
