var mozart = require('mozart');

var Behavior = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function(action) {
		_(this).action = action;
	};
	prototype.act = function(bodyPriv, bodyPubl){
		_(this).action(bodyPriv, bodyPubl);
	};
});

var gravitate = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPriv.fixed){
		bodyPriv.k.ay += 2;
	}
});

var Collision = Behavior.subclass(function(prototype, _, _protected, __, __private) {
	prototype.init = function(action) {
		prototype.super.init.call(this, action);
		__(this).pairs = [];
	};
	prototype.find = function(enginePriv, enginePubl){
		__(this).pairs = [];
		var world = enginePriv.world;
		for(var i = 0; i < world.length; i++){
			var obj1 = world[i];
			var k1 = obj1.getK(), b1 = obj1.getBox(), m1 = obj1.getMass(), t1 = obj1.getType();
			for(var j = i + 1; j < world.length; j++){
				var obj2 = world[j];
				var k2 = obj2.getK(), b2 = obj2.getBox(), m2 = obj2.getMass(), t2 = obj2.getType();
				if((k1.x < k2.x && k1.x + b1[1] > k2.x - b2[3]) || (k1.x >= k2.x && k1.x - b1[3] < k2.x + b2[1])){
					if((k1.y < k2.y && k1.y + b1[2] > k2.y - b2[0]) || (k1.y >= k2.y && k1.y - b1[0] < k2.y + b2[2])){
						__(this).pairs.push([{obj: obj1, k: k1, b: b1, m: m1, t: t1},{obj: obj2, k: k2, b: b2, m: m2, t: t2}]);
					}
				}
			}
		}
	};
	prototype.getPairs = function(){
		return __(this).pairs;
	};
	prototype.act = function(bodyPriv, bodyPubl){
		_(this).action(bodyPriv, bodyPubl);
	};
});


// make a collect object same as this for coins
var collide = new Collision(function(bodyPriv, bodyPubl){
	var pairs = collide.getPairs();
	var col = null;
	for(var i in pairs){
		if(pairs[i][0].obj == bodyPubl){
			col = pairs[i];
		}else if(pairs[i][1].obj == bodyPubl){
 			col = [pairs[i][1], pairs[i][0]];
		}else{
			continue;
		}
	}
	if(col !== null){
		var k1 = col[0].k;
		var k2 = col[1].k;
		// more efficient to move this overlap section into the engine one collision pair finder.
		var box1 = [-col[0].b[0]+k1.y, col[0].b[1]+k1.x, col[0].b[2]+k1.y, -col[0].b[3]+k1.x];
		var box2 = [-col[1].b[0]+k2.y, col[1].b[1]+k2.x, col[1].b[2]+k2.y, -col[1].b[3]+k2.x];
		var overlap = [0,0];

		if((box2[0] < box1[0] && box1[0] < box2[2] && box2[2] < box1[2]) || (box1[0] < box2[0] && box2[0] < box1[2] && box1[2] < box2[2])){
			if(Math.abs(box1[0] - box2[2]) < Math.abs(box1[2] - box2[0])){
				overlap[1] = box1[0] - box2[2];
			}else{
				overlap[1] = box1[2] - box2[0];
			}
		}

		if((box2[3] < box1[3] && box1[3] < box2[1] && box2[1] < box1[1]) || (box1[3] < box2[3] && box2[3] < box1[1] && box1[1] < box2[1])){
			if(Math.abs(box1[3] - box2[1]) < Math.abs(box1[1] - box2[3])){
				overlap[0] = box1[3] - box2[1];
			}else{
				overlap[0] = box1[1] - box2[3];
			}
		}
		if(col[1].m != -1){
			bodyPriv.k.x -= overlap[0] * col[0].m / (col[0].m + col[1].m);
			bodyPriv.k.y -= overlap[1] * col[0].m / (col[0].m + col[1].m);
		}else{
			bodyPriv.k.x -= (overlap[0] - 0.5);
			bodyPriv.k.y -= (overlap[1] - 0.5);
		}
		///////////////////////////////// relative velocities
		bodyPriv.k.vx  = bodyPriv.k.vx / -2 ;
		bodyPriv.k.vy  = bodyPriv.k.vy / -2 ;
	}
});
