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
		var b =  prototype.super.super.getBox.call(this, "cached");
		k.energy = p.energy; k.health = p.health; k.coins = p.coins; k.nextMove = p.nextMove;
		k.box = []; k.box[0] = b[0]; k.box[1] = b[1]; k.box[2] = b[2]; k.box[3] = b[3];
		k.width = b[1] - b[3]; k.height = b[2] - b[0];
		return k;
	};

	prototype.keyboardControlMap = {
		68: {type: "move", amount: 10},
		65: {type: "move", amount: -10},
		87: {type: "jump"},
		69: {type: "jump", amount: 10},
		81: {type: "jump", amount: -10},
		84: {type: "turn"},
		71: {type: "shoot"},
	};

	prototype.on = function(eventName, callback){
		var events = _protected.super.super.getProperties.call(this).events;
		for(e of events){
			if(e.event == eventName){
				callback(e);
			}
		}
	}

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
		try{
			this.playerCode(robot);
		}catch(err){
			resetCode();
			console.error(err.name + ": " + err.message)
		}
		ac = 'wait';
		if(robot.action){
			ac = JSON.parse(JSON.stringify(robot.action));
		}
		this.setAction(ac);
		//robot.action = 'wait';
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
				console.log("KEYBOARD INPUT: keyCode = " + _ac.keyCode, 'robot.setAction(' + action + ');');
			}else{
				ac = {action: 'wait'};
			  console.log("KEYBOARD INPUT: keyCode = " + _ac.keyCode, '');
			}
		}else if(typeof(_ac) == 'string'){
			ac = {type: _ac};
		}else if(_ac.type === undefined || _ac.type === null){
			return;
		}else if(_ac.amount === undefined || _ac.amount === null){
			ac = {type: _ac.type};
		}else{
			ac = {type: _ac.type, amount: _ac.amount};
		}

		if(ac.type == 'move'){
			dx = ac.amount || 10;
			this.move(dx);
		}else if(ac.type == 'jump'){
			dx = ac.amount || 0;
			this.jump(dx);
		}else if(ac.type == 'turn'){
			this.turn();
		}else if(ac.type == 'shoot'){
			this.shoot();
		}

		ac.type = 'wait';
	};

	prototype.playerCode = function(robot){};

});



return {'Robot': Robot, 'RobotOne': RobotOne};
});
