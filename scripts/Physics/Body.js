var Body = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function(opts) {
		__(this).fixed = opts.fixed || false;
		__(this).agent = opts.agent || false;
		__(this).sprites = [];
		__(this).toBeDestroyed = false;
		__(this).k = {t: 0, x: opts.x || 0, y: opts.y || 0, vx: opts.vx || 0, vy: opts.vy || 0, ax: opts.ax || 0, ay: opts.ay || 0};
		__(this).oldk = {t: 0, x: opts.x || 0, y: opts.y || 0, vx: opts.vx || 0, vy: opts.vy || 0, ax: opts.ax || 0, ay: opts.ay || 0};
		__(this).mass = opts.mass || 0;
		// I dont think this is necessary anymore __(this).privateKey = Math.random().toString(36).substring(2);
	};
	prototype.getK = function(){ return JSON.parse(JSON.stringify(__(this).k)); };
	prototype.isFixed = function(){ return __(this).fixed; };
	prototype.toBeDestroyed = function(){ return __(this).toBeDestroyed;};

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
		if(__(this).agent){
			this.step();
		}
		//none of this should be here anymore
		__(this).k.vy += 2;
		if(__(this).k.y < 400 - __(this).k.vy){
			__(this).k.y += __(this).k.vy;
		}else{
			__(this).k.y = 400;
			__(this).k.vy=-__(this).k.vy/2;
		}
		if(Math.abs(__(this).k.vy)<=0.001){
			__(this).k.vy=0;
		}
		// this has to stay, down here though?
		__(this).oldk = JSON.parse(JSON.stringify(__(this).k));
	};
});

