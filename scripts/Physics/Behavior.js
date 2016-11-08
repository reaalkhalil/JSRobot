var mozart = require('mozart');

var Behavior = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function(action) {
		__(this).action = action;
	};
	prototype.act = function(bodyPriv, bodyPubl){
		__(this).action(bodyPriv, bodyPubl);
	};
});

var gravitate = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPriv.fixed){
		bodyPriv.k.ay += 2;
	}
});

var collide = new Behavior(function(bodyPriv, bodyPubl){
	var world = engine.worldData(bodyPubl);
	//loop through
	//remove object called from world [X]
	
});

