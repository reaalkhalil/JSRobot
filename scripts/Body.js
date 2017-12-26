define(['mozart', 'Behavior', 'Collision', 'Player'], function (mozart, behavior, collide, player) {
gravitate = behavior.g;
gameObjectBehaviors = behavior.o;
var Body = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function(opts) {
		__(this).fixed = opts.fixed || false;
		__(this).agent = opts.agent || false;
		__(this).sprites = opts.sprites || [];
		__(this).toBeDestroyed = false;
		__(this).k = {t: opts.t || 0, x: opts.x || 0, y: opts.y || 0, vx: opts.vx || 0, vy: opts.vy || 0, ax: opts.ax || 0, ay: opts.ay || 0};
		__(this).oldk = {t: 0, x: opts.x || 0, y: opts.y || 0, vx: opts.vx || 0, vy: opts.vy || 0, ax: opts.ax || 0, ay: opts.ay || 0};
		__(this).mass = opts.mass || 1;
		__(this).behaviors = opts.behaviors || [];
		__(this).type = opts.type || [];
		__(this).properties = opts.properties || {};
		__(this).onGround = false;
		__(this).engine = null;
		__(this).lifetime = opts.lifetime || -1;
		__(this).box = null;
		for(var i=0; i < __(this).sprites.length; i++){
			if(!__(this).sprites[i].hasContainer()){
				__(this).sprites[i].setParent(this);
			}
		}
	};
	prototype.getK = function(){ return JSON.parse(JSON.stringify(__(this).k)); };
	prototype.getType = function(){ return __(this).type; };
	prototype.getMass = function(){ return __(this).mass; };
	prototype.isFixed = function(){ return __(this).fixed; };
	prototype.isAgent = function(){ return __(this).agent; };
	prototype.onGround = function(){ return __(this).onGround; };
	prototype.toBeDestroyed = function(){ return __(this).toBeDestroyed;};

	prototype.setEngine = function(priv, publ){
		if(__(this).engine === null){
			__(this).engine = {priv: priv, publ: publ};
		}
	};

	prototype.getBox = function(a){
		var k = __(this).k;
		if(a === "cached"){
			return __(this).box;
		}
		var box = [0,0,0,0]; // top right bottom left
		for(var i in __(this).sprites){
			var info = __(this).sprites[i].getInfo();
			if(!info.v){continue;}// if sprite is invisible dont count it in
			box[0] = Math.max(box[0], -info.y + info.h/2);
			box[1] = Math.max(box[1], info.x + info.w/2);
			box[2] = Math.max(box[2], info.y + info.h/2);
			box[3] = Math.max(box[3], -info.x + info.w/2);
		}
		__(this).box = [k.y - box[0], k.x + box[1], k.y + box[2], k.x - box[3]];
		return JSON.parse(JSON.stringify(__(this).box));
	};
	prototype.getDimensions = function(){
		var box = this.getBox();
		var width = box[1] - box[3];
		var height = box[2] - box[0];
		return {w: width, h: height};
	};

	prototype.render = function(x,y){
		for(var i in __(this).sprites){
			__(this).sprites[i].redraw(x,y);
		}
	};
	__private.getSprite = function(name){
		for(var i in __(this).sprites){
			if(__(this).sprites[i].getInfo().n == name){
				return __(this).sprites[i];
			}
		}
	};

	prototype.addSprite = function(sprite){
		__(this).sprites.push(sprite);
		sprite.setParent(this);
	};

	_protected.getProperties = function(move){
		return JSON.parse(JSON.stringify(__(this).properties));
	};

	prototype.update = function(){
		if(this.getK().t + 1 != engine.getTime()){return;}
		__(this).k.t += 1;
		if(__(this).lifetime != -1){
			__(this).lifetime--;
			if(__(this).lifetime === 0){
				__(this).toBeDestroyed = true;
			}
		}
		if('properties' in this && this.properties !== null){
			this.properties.onGround = __(this).onGround;
		}else{
			this.properties = {onGround: __(this).onGround};
		}
		__(this).onGround = false;
		gravitate.act(__(this), this);
		collide.act(__(this), this);
		if(__(this).type in gameObjectBehaviors){
			gameObjectBehaviors[__(this).type].act(__(this), this);
		}

		if(__(this).agent){
			if(this.getK().t % 10 === 0){
				try {
					this.step(this);
				}
				catch(err) {
					this.step = function(){};
					console.error(err.name + " " + err.message);
				}
			}
			player.act(__(this), this);
		}

		var dt = 1;

		__(this).oldk = JSON.parse(JSON.stringify(__(this).k));
		__(this).k.vx = __(this).k.vx + __(this).k.ax * dt;
		__(this).k.vy = __(this).k.vy + __(this).k.ay * dt;
		__(this).k.x = __(this).k.x + ( __(this).oldk.vx + __(this).k.vx ) * dt / 2;
		__(this).k.y = __(this).k.y + ( __(this).oldk.vy + __(this).k.vy ) * dt / 2;
		__(this).k.ax = 0;
		__(this).k.ay = 0;
	};
});

return Body;
});
