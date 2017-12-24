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
		var flag = [];
		var coins = [];
		var boxes = [];
		var batteries = [];
		var walls = [];
		var sparkstrips = [];
		var bullets = [];
		var enemies = [];
		var gunEnemies = [];
		var lifts = [];
		var turrets = [];
		var portals = [];
		var spikes = [];
		for(var j in __(this).world){
			var obj = {};
			var o = __(this).world[j];
			var k = o.getK();
			var t = o.getType();
			if(t=="effects"){continue;}
			var w = o.getDimensions().w;
			var h = o.getDimensions().h;

			obj = {x: k.x, y: k.y, vx: k.vx, vy: k.vy, ax: k.ax, ay: k.ay};

			if(t == "flag"){ flag.push(obj); }
			if(t == "coin"){ coins.push(obj); }
			if(t == "boxes"){ boxes.push(obj); }
			if(t == "battery"){ batteries.push(obj); }
			if(t == "wall"){ walls.push(obj); }
			if(t == "sparkstrip"){ sparkstrips.push(obj); }
			if(t == "bullet"){ bullets.push(obj); }
			if(t == "gunEnemy"){
				if('properties' in o){
					obj.health = o.properties.health;
				}
				gunEnemies.push(obj);
			}
			if(t == "enemy"){
				if('properties' in o){
					obj.health = o.properties.health;
				}
				enemies.push(obj);
			}
			if(t == "lift"){ lifts.push(obj); }
			if(t == "turret"){ turrets.push(obj); }
			if(t == "portal"){
				if('properties' in o &&
					o.properties !== null &&
					'portalDestination' in o.properties &&
					o.properties.portalDestination !== null){
					obj.destination =
						{x: o.properties.portalDestination.x,
						y: o.properties.portalDestination.y};
				}
				portals.push(obj);
			}
			if(t == "spikes"){
				if('properties' in o){
					obj.spikesUp = o.properties.spikesUp;
				}
				spikes.push(obj);
			}
		}
		Game.flag = flag;
		Game.coins = coins;
		Game.boxes = boxes;
		Game.batteries = batteries;
		Game.walls = walls;
		Game.sparkstrips = sparkstrips;
		Game.bullets = bullets;
		Game.enemies = enemies;
		Game.gunEnemies = gunEnemies;
		Game.lifts = lifts;
		Game.turrets = turrets;
		Game.portals = portals;
		Game.spikes = spikes;
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
				mousePosGame = {x: mousePosCanvas.x, y: mousePosCanvas.y};
				mousePosGame.x += e.x;
				mousePosGame.y += e.y;
				document.getElementById('hud-mouse-coords').innerHTML = '{x: ' +
					Math.round(mousePosGame.x) + ', y: ' + Math.round(mousePosGame.y) + '}';

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
