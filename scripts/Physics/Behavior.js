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
	var k1 = bodyPriv.k;
	var m1 = bodyPriv.mass;
	var b1 = bodyPubl.getBox();
	var world = engine.worldData(bodyPubl);
	for(var i in world){
		var k2 = world[i].k;
		var b2 = world[i].box;
		var m2 = world[i].mass;
		var collided = false;
		if((k1.x < k2.x && k1.x + b1[1] > k2.x - b2[3]) || (k1.x >= k2.x && k1.x - b1[3] < k2.x + b2[1])){
			if((k1.y < k2.y && k1.y + b1[2] > k2.y - b2[0]) || (k1.y >= k2.y && k1.y - b1[0] < k2.y + b2[2])){
				collided = true;
			}
		}
		if(collided && 0 <= (k1.vx - k2.vx)*(k2.x - k1.x) + (k1.vy - k2.vy)*(k2.y - k1.y)){
			// position this object away from the collision
			bodyPriv.k.vx = -k1.vx/2;
			bodyPriv.k.vy = -k1.vy/2;
			bodyPriv.k.x += bodyPriv.k.vx;//nope
			bodyPriv.k.y += bodyPriv.k.vy;//nope
		}
	}
});
