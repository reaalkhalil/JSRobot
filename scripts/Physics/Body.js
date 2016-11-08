var Body = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function(options) {
		__(this).x = options.x;
		__(this).y = options.y;
		this.vx = 0;
		this.vy = 0;
		__(this).fixed = options.fixed || false;
		__(this).agent = options.agent || false;
		__(this).sprites = [];
		__(this).privateKey = Math.random().toString(36).substring(2);
	};
	prototype.getX = function(){ return __(this).x; };
	prototype.getY = function(){ return __(this).y; };
	prototype.fixed = function(){ return __(this).fixed; };

	prototype.addSprite = function(sprite){
		__(this).sprites.push(sprite);
		sprite.setParent(this);
	};
	_protected.move = function(dx,dy){
		//console.log(_(this).move.caller);
		__(this).x += dx;
		__(this).y += dy;
	};
	prototype.fall = function(){
		if(__(this).y < 400 - this.vy){
			__(this).y += this.vy;
		}else{
			__(this).y = 400;
			this.vy=-this.vy/2;
		}
		if(Math.abs(this.vy)<=0.001){
			this.vy=0;
		}
	};
});

