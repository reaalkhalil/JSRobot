var Body = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function(opts) {
		__(this).fixed = opts.fixed || false;
		__(this).agent = opts.agent || false;
		__(this).sprites = [];
		__(this).toBeDestroyed = false;
		__(this).k = {t: 0, x: opts.x || 0, y: opts.y || 0, vx: opts.vx || 0, vy: opts.vy || 0, ax: opts.ax || 0, ay: opts.ay || 0};
		__(this).oldk = {t: 0, x: opts.x || 0, y: opts.y || 0, vx: opts.vx || 0, vy: opts.vy || 0, ax: opts.ax || 0, ay: opts.ay || 0};
		__(this).mass = opts.mass || 0;
		__(this).behaviors = opts.behaviors || [];
		__(this).type = opts.type || [];
	};
	prototype.getK = function(){ return JSON.parse(JSON.stringify(__(this).k)); };
	prototype.getType = function(){ return __(this).type; };
	prototype.getMass = function(){ return __(this).mass; };
	prototype.isFixed = function(){ return __(this).fixed; };
	prototype.toBeDestroyed = function(){ return __(this).toBeDestroyed;};

	prototype.getBox = function(){
		var box = [0,0,0,0]; // top right bottom left
		for(var i in __(this).sprites){
			var info = __(this).sprites[i].getInfo();
			if(!info.v){continue;}// if sprite is invisible dont count it in
			box[0] = Math.max(box[0], info.y + info.h/2);
			box[1] = Math.max(box[1], info.x + info.w/2);
			box[2] = Math.max(box[2], -info.y + info.h/2);
			box[3] = Math.max(box[3], -info.x + info.w/2);
		}
		return box;
	};

	prototype.render = function(){
		for(var i in __(this).sprites){
			__(this).sprites[i].redraw();
		}
	};

	prototype.addSprite = function(sprite){
	//should be private possibly defined in constructor
		__(this).sprites.push(sprite);
		sprite.setParent(this);
	};
	_protected.move = function(dx,dy){
		//console.log(_(this).move.caller);
		__(this).k.x += dx;
		__(this).k.y += dy;
	};
	prototype.update = function(){
		if(this.getK().t + 1 != engine.getTime()){return;}
		__(this).k.t += 1; // check if this is a good place to do this
		// make this into a behaviour?: nahhh
		// call behaviors!
		gravitate.act(__(this), this);
		collide.act(__(this), this);
		// this works but needs the behaviours need to be in body's array
		if(__(this).agent){
			this.step();
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

