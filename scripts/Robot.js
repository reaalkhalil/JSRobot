define(['mozart', 'Body'], function (mozart, Body) {
var Robot = Body.subclass(function(prototype, _, _protected, __, __private) {
	prototype.init = function(options) {
		prototype.super.init.call(this, options);
	};

});


var RobotOne = Robot.subclass(function(prototype, _, _protected, __, __private) {
	prototype.init = function(options) {
		prototype.super.init.call(this, options);
	};

	prototype.info = function(){
		var p = _protected.super.super.getProperties.call(this);
		var k =  prototype.super.super.getK.call(this);
		k.energy = p.energy; k.health = p.health; k.coins = p.coins; k.nextMove = p.nextMove;
		return k;
	};

	prototype.wait = function(){
		_protected.super.super.setNextMove.call(this,null);
	};
	prototype.turn = function(){
		_protected.super.super.setNextMove.call(this,"turn");
	};
	prototype.gun = function(){
		_protected.super.super.setNextMove.call(this,"gun");
	};
	prototype.jump = function(){
		if(this.onGround() && Math.abs(this.getK().vy)<1){
			_protected.super.super.setNextMove.call(this,"jump");
		}
	};
	prototype.move = function(dx){
		if(dx != Number(dx)){dx = 10;}
		_protected.super.super.setNextMove.call(this,"move:"+dx);
	};

	prototype.command = function(commandFn){
		try{
			var output = commandFn.call(this);
			return {error: null, output: output};
		}catch(err){
			return {error: err, output: null};
		}
	};

	prototype.step = function(robot){
		ac = this.playerCode(robot);

		this.setAction(ac);
	};

	prototype.setAction = function(ac){

		if(ac === undefined || ac === null){
			return;
		}

		if(typeof(ac) == 'string'){
			ac = {action: ac};
		}else if(ac.action === undefined || ac.action === null){
			return;
		}
		if(ac.action == 'move'){
			dx = ac.amount || 10;
			this.move(dx);
		}else if(ac.action == 'jump'){
			this.jump();
		}else if(ac.action == 'turn'){
			this.turn();
		}else if(ac.action == 'shoot'){
			this.shoot();
		}else if(ac.action == 'shoot'){
			this.wait();
		}
	};

	prototype.playerCode = function(robot){};

});



return {'Robot': Robot, 'RobotOne': RobotOne};
});
