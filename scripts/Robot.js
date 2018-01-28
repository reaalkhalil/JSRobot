/*jshint esversion: 6 */
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
		k.energy = p.energy; k.health = p.health; k.coins = p.coins;
		k.box = []; k.box[0] = b[0]; k.box[1] = b[1]; k.box[2] = b[2]; k.box[3] = b[3];
		k.width = b[1] - b[3]; k.height = b[2] - b[0];
		return k;
	};

	prototype.keyboardControlMap = {
		68: {type: "move", amount: 20},
		65: {type: "move", amount: -20},
		87: {type: "jump"},
		69: {type: "jump", amount: 5},
		81: {type: "jump", amount: -5},
		84: {type: "turn"},
		71: {type: "shoot"},
	};

	prototype.on = function(eventName, callback){
		var events = _protected.super.super.getProperties.call(this).events;
		for(var e of events){
			if(e.event == eventName){
				callback(e);
			}
		}
	};

	prototype.wait = function(){
		this.setAction({type: 'wait'});
	};
	prototype.turn = function(){
		this.setAction({type: 'turn'});
	};
	prototype.shoot = function(){
		this.setAction({type: 'shoot'});
	};
	prototype.jump = function(dx){
		if(dx != Number(dx)){dx = 0;}
		this.setAction({type: 'jump', amount: dx});
	};
	prototype.move = function(dx){
		if(dx != Number(dx)){dx = 0;}
		this.setAction({type: 'move', amount: dx});
	};

	prototype.command = function(commandFn, a){
		try{
			var output = commandFn.call(this, a);
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
			console.error(err.name + ": " + err.message);
		}
		ac = 'wait';
		if(robot.action && robot.action !== undefined){
			ac = robot.action;
		}
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
				console.log("KEYBOARD INPUT: keyCode = " + _ac.keyCode, 'robot.setAction(' + action + ');');
			}else{
				ac = {type: 'wait'};
			  console.log("KEYBOARD INPUT: keyCode = " + _ac.keyCode, '');
			}
		}else if(typeof(_ac) == 'string'){
			ac = {type: _ac};
		}else if(typeof(_ac) == 'object' && 'type' in _ac && _ac.type){
			if('amount' in _ac && _ac.amount){
				ac = {type: _ac.type, amount: _ac.amount};
			}else{
				ac = {type: _ac.type};
			}
		}

		if(ac.type == 'move' && !('amount' in ac)){
			ac.amount = this.properties.facing * 20;
		}

		if(['move', 'jump', 'turn', 'shoot', 'wait'].indexOf(ac.type) != -1 ){
			this.action = ac;
		}else{
			console.error('Error: Invalid action ' + ac.type);
		}

	};

	prototype.playerCode = function(robot){};

});



return {'Robot': Robot, 'RobotOne': RobotOne};
});
