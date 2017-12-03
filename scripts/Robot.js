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

	prototype.keyboardControlMap = {
		68: {action: "move", amount: 10},
		65: {action: "move", amount: -10},
		87: {action: "jump"},
		69: {action: "jump", amount: 10},
		81: {action: "jump", amount: -10},
		84: {action: "turn"},
		71: {action: "shoot"},
	};

	prototype.wait = function(){
		_protected.super.super.setNextMove.call(this,null);
	};
	prototype.turn = function(){
		_protected.super.super.setNextMove.call(this,"turn");
	};
	prototype.shoot = function(){
		_protected.super.super.setNextMove.call(this,"shoot");
	};
	prototype.jump = function(dx){
		if(dx != Number(dx)){dx = 0;}
		_protected.super.super.setNextMove.call(this,"jump:" + dx);
	};
	prototype.move = function(dx){
		if(dx != Number(dx)){dx = 10;}
		_protected.super.super.setNextMove.call(this,"move:" + dx);
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

	prototype.setAction = function(_ac){
		if(!_ac){return;}
		if(_ac === undefined || _ac === null){
			return;
		}

		if(typeof(_ac) == 'object' && _ac.keyCode){
			var action = JSON.stringify(this.keyboardControlMap[String(_ac.keyCode)]);
			if(action && action != 'undefined'){
				ac = JSON.parse(action);
				console.error("KEYBOARD INPUT: " + _ac.keyCode + "  =>  " + action);
			}else{
				ac = {action: 'wait'};
				console.error("KEYBOARD INPUT: " + _ac.keyCode + "  NO ACTION ASSIGNED");
			}
		}else if(typeof(_ac) == 'string'){
			ac = {action: _ac};
		}else if(_ac.action === undefined || _ac.action === null){
			return;
		}else if(_ac.amount === undefined || _ac.amount === null){
			ac = {action: _ac.action};
		}else{
			ac = {action: _ac.action, amount: _ac.amount};
		}

		if(ac.action == 'move'){
			dx = ac.amount || 10;
			this.move(dx);
		}else if(ac.action == 'jump'){
			dx = ac.amount || 0;
			this.jump(dx);
		}else if(ac.action == 'turn'){
			this.turn();
		}else if(ac.action == 'shoot'){
			this.shoot();
		}else if(ac.action == 'shoot'){
			this.wait();
		}
		ac.action = 'wait';
	};

	prototype.playerCode = function(robot){};

});



return {'Robot': Robot, 'RobotOne': RobotOne};
});
