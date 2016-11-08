var Robot = Body.subclass(function(prototype, _, _protected, __, __private) {
	prototype.init = function(options) {
		__(this).health = 100;
		__(this).energy = 100;
		__(this).coins = 0;
		prototype.super.init.call(this, options);
	};

	prototype.getOpponentProperties = function(){
		return __(this).opponent.getK();
	};

	prototype.setOpponent = function(op){
		__(this).opponent = op;
	};
	prototype.getEnergy = function(){ return __(this).energy; };
	_protected.move = function(dx,dy){
		__(this).energy -= Math.abs(dx^2 + dy^2)/10;
		//maybe make body call a function here to reduce enrgy if agent == true and remove this move function
		// nahhh, use behaviors and next action private member
		_protected.super.move.call(this,dx,dy);
			//doesnt work
	};
});


var RobotOne = Robot.subclass(function(prototype, _, _protected, __, __private) {
	prototype.init = function(options) {
		prototype.super.init.call(this, options);
	};
	
	__private.move = function(that,dx,dy){
		_protected.super.move.call(that,dx,dy);
	};

	prototype.step = function(){
		//console.log(this);
		// this.update(); this doesnt work woohoo
		var _x = this.getK().x;
		var _op = this.getOpponentProperties();
		var towardopponent = (_op.x - _x) / Math.abs(_op.x - _x);

		if(Math.abs(_op.x - _x) > 200){
			__(this).move(this,towardopponent*2,0);
			//_protected.super.super.move.call(this,towardopponent*5,0);
			//console.log(this.getEnergy());
		}else{
		}
	};
});
		




/*
var Robot = Body.subclass(function(prototype, _, _protected, __, __private) {
	prototype.init = function(x, y, img) {
		__(this).x = x;
		__(this).y = y;
		__(this).image = img;
		__(this).health = 100;
		__(this).energy = 100;
		__(this).coins = 0;
		elements.push(this);
		gravitatingObjects.push(this);
	};
	prototype.getX = function(){
		return __(this).x;
	};

	prototype.getOpponentProperties = function(){
		return {x: __(this).opponent.getX()};
	};

	prototype.setOpponent = function(op){
		__(this).opponent = op;
	};

	prototype.redraw = function(){
		context.drawImage(images[__(this).image], __(this).x, __(this).y, 30, 41);
	};

	_protected.move = function(dx,dy){
		__(this).x += dx;
		__(this).y += dy;
	};
});


var RobotOne = Robot.subclass(function(prototype, _, _protected, __, __private) {
	prototype.init = function(x, y, img) {
		prototype.super.init.call(this, x, y, img);
	};

	prototype.step = function(){
		var _x = prototype.super.getX.call(this);
		var _op = prototype.super.getOpponentProperties.call(this);
		var towardopponent = (_op.x - _x) / Math.abs(_op.x - _x);

		if(Math.abs(_op.x - _x) > 200){
			_protected.super.move.call(this,towardopponent*5,0);
		}else{
		}
	}
});

*/
