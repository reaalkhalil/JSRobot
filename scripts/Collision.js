define(['mozart', 'Behavior', 'Player'], function (mozart, behavior, player) {
Behavior = behavior.B;
gameObjectBehaviors = behavior.o;
playerCollide = player.collideWith;
// include the bottom bits into the subclass and then make a new collision object in main.js

var Collision = Behavior.subclass(function(prototype, _, _protected, __, __private) {
	prototype.init = function(action) {
		prototype.super.init.call(this, action);
		__(this).pairs = [];
	};

	prototype.getOverlap = function(b1, b2){
		var overlap = [false,false];
		if((b1[1] + b1[3] < b2[1] + b2[3] && b1[1] > b2[3]) || (b1[1] + b1[3] >= b2[1] + b2[3]  && b1[3] < b2[1])){
			overlap[1] = 0;
		}
		if((b1[0] + b1[2] < b2[0] + b2[2]  &&  b1[2] >  b2[0]) || (b1[0] + b1[2] >= b2[0] + b2[2] && b1[0] <  b2[2])){
			overlap[0] = 0;
		}

		if((b2[0] < b1[0] && b1[0] < b2[2] && b2[2] < b1[2]) || (b1[0] < b2[0] && b2[0] < b1[2] && b1[2] < b2[2])){
			if(Math.abs(b1[0] - b2[2]) < Math.abs(b1[2] - b2[0]))
			{overlap[1] = b1[0] - b2[2];}else{overlap[1] = b1[2] - b2[0];}
		}

		if((b2[3] < b1[3] && b1[3] < b2[1] && b2[1] < b1[1]) || (b1[3] < b2[3] && b2[3] < b1[1] && b1[1] < b2[1])){
			if(Math.abs(b1[3] - b2[1]) < Math.abs(b1[1] - b2[3]))
			{overlap[0] = b1[3] - b2[1];}else{overlap[0] = b1[1] - b2[3];}
		}
		return overlap;
	};

	prototype.getPredictiveOverlap = function(b1, b1a, b2, b2a){
		var overlap = [0,0];
		if(Math.sign(b2[3] - b1[1])*Math.sign(b2a[3] - b1a[1]) != 1){
			overlap[0] = b1a[1] - b2a[3];
		}
		if(Math.sign(b2[1] - b1[3])*Math.sign(b2a[1] - b1a[3]) != 1){
			if(overlap[0] === 0 || Math.abs(b2a[1] - b1a[3]) > Math.abs(b2a[3] - b1a[1])){
				overlap[0] = b1a[3] - b2a[1];
			}
		}
		if(Math.sign(b2[0] - b1[2])*Math.sign(b2a[0] - b1a[2]) == -1){
			overlap[1] = b1a[2] - b2a[0];
		}
		if(Math.sign(b2[2] - b1[0])*Math.sign(b2a[2] - b1a[0]) == -1){
			if(overlap[1] === 0 || Math.abs(b2a[2] - b1a[0]) > Math.abs(b2a[0] - b1a[2])){
				overlap[1] = b1a[0] - b2a[2];
			}
		}
		return overlap;
	};

	prototype.find = function(enginePriv, enginePubl){
		__(this).pairs = [];
		var world = enginePriv.world;
		for(var i = 0; i < world.length; i++){
			var obj1 = world[i];
			if(["wall"].indexOf(obj1.getType()) != -1){continue;}
			var k1 = obj1.getK(), b1 = obj1.getBox(), m1 = obj1.getMass(), t1 = obj1.getType();
			var b1a = [b1[0] + k1.vy, b1[1] + k1.vx, b1[2] + k1.vy, b1[3] + k1.vx];

			for(var j =  0; j < world.length; j++){
				if(i == j){continue;}
				var obj2 = world[j];
				if(["player"].indexOf(obj2.getType()) != -1){continue;}
				var k2 = obj2.getK(), b2 = obj2.getBox(), m2 = obj2.getMass(), t2 = obj2.getType();
				var b2a = [b2[0] + k2.vy, b2[1] + k2.vx, b2[2] + k2.vy, b2[3] + k2.vx];

				// BROAD PHASE:
				if(Math.abs(k2.x - k1.x) > Math.abs(k2.vx - k1.vx) + b2[1] - b2[3] + b1[1] - b1[3]){
					continue;
				}
				if(Math.abs(k2.y - k1.y) > Math.abs(k2.vy - k1.vy) + b2[2] - b2[0] + b1[2] - b1[0]){
					continue;
				}
				// NARROW PHASE:
				var overlap = [0,0];
				var overlapC = this.getOverlap(b1, b2);
				var overlapP = this.getPredictiveOverlap(b1, b1a, b2, b2a);

					//stops glitching at the edges of platforms
					// on ground code at the end works better actually
				//if(overlapC[0] === 0 && Math.abs(overlapC[1]) < 50 && Math.abs(overlapP[0]) > 0 && overlapP[1] === 0 && (t1 == "wall" || t2 == "wall")){
					//overlapP[0] = 0;
					////overlapP[1] = 1;
				//}

				if((overlapP[0] === 0 || overlapP[1] === 0) && overlapC[0] === false && overlapC[1] === false){
					continue;
				}

				if(overlapP[0] === 0 && overlapP[1] === 0){
					if((k1.x < k2.x && b1[1] > b2[3]) || (k1.x >= k2.x && b1[3] < b2[1])){
						if((k1.y < k2.y &&  b1[2] >  b2[0]) || (k1.y >= k2.y && b1[0] <  b2[2])){
							overlap = overlapC;
							if(Math.abs(overlap[0]) < Math.abs(overlap[1]) && overlap[0] !== 0){overlap[1] = 0;}
							if(Math.abs(overlap[1]) < Math.abs(overlap[0]) && overlap[1] !== 0){overlap[0] = 0;}
						}else{continue;}
					}else{continue;}
				}else{overlap =	overlapP;}
				if(overlapC[0] !== 0 && overlapC[1] !== 0){
					overlap = overlapC;
							if(Math.abs(overlap[0]) < Math.abs(overlap[1]) && overlap[0] !== 0){overlap[1] = 0;}
							if(Math.abs(overlap[1]) < Math.abs(overlap[0]) && overlap[1] !== 0){overlap[0] = 0;}
				}

				if(overlapC[0] === 0 && overlapP[0] === 0 && overlapC[1] !== 0 && overlapP[1] !== 0  ||
					overlapC[1] === 0 && overlapP[1] === 0 && overlapC[0] !== 0 && overlapP[0] !== 0){
					continue;
				}

				if(overlapC[0] === false && overlapP[0] === false || overlapC[1] === 0 && overlapP[1] === 0){
					//continue;
				}

				cp1 = null;
				cp2 = null;
				if('properties' in obj1){
					cp1 = obj1.properties;
				}
				if('properties' in obj2){
					cp2 = obj2.properties;
				}

				__(this).pairs.push({
					overlap: overlap,
					obj1: {obj: obj1, k: k1, b: b1, m: m1, t: t1, properties: cp1},
					obj2: {obj: obj2, k: k2, b: b2, m: m2, t: t2, properties: cp2}
				});
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

var collide = new Collision(function(bodyPriv, bodyPubl){

	var pairs = collide.getPairs();
	var col = null;
	for(var i in pairs){
		if(pairs[i].obj1.obj == bodyPubl){
			col = pairs[i];
		}else if(pairs[i].obj2.obj == bodyPubl){
 			col = {overlap: [-pairs[i].overlap[0],-pairs[i].overlap[1]],
					obj1: pairs[i].obj2,
					obj2: pairs[i].obj1};
		}else{
			continue;
		}

		var skipX = false;
		var skipY = false;
		var groundCollision = false;

		if(bodyPriv.type in gameObjectBehaviors && gameObjectBehaviors[bodyPriv.type].collideBehavior)
		{
			skip = gameObjectBehaviors[bodyPriv.type].collideWith(bodyPriv, bodyPubl, col.obj2);
			if(typeof(skip) == 'string' && skip == 'skipX'){
				skipX = true;
			}
			if(typeof(skip) == 'boolean' && skip){
				continue;
			}
		}

		if(bodyPriv.type == 'player'){
			skip = player.collideWith(bodyPriv, bodyPubl, col.obj2);
			if(typeof(skip) == 'string' && skip == 'skipX'){
				skipX = true;
			}
			if(typeof(skip) == 'boolean' && skip){
				continue;
			}
		}

		var k1 = col.obj1.k;
		var k2 = col.obj2.k;
		var overlap = col.overlap;

		var relvx = k1.vx - k2.vx;
		var relvy = k1.vy - k2.vy;

		if(Math.abs(col.obj2.b[0] - col.obj1.b[2]) < 7){
			bodyPriv.onGround = true;
			overlap[1] *= 0.4;
			overlap[0] = 0;
		}else{
			overlap[1] += 0.25;
		}

		if('properties' in col.obj2 &&
					col.obj2.properties !== null &&
					'onGround' in col.obj2.properties &&
					col.obj2.properties.onGround === true &&
					bodyPriv.onGround === true &&
					bodyPriv.k.vy <= 0 &&
					bodyPubl.getBox()[0] < col.obj2.b[0]){
			groundCollision = true;
		}

		if('properties' in bodyPubl &&
					bodyPubl.properties !== null &&
					'onGround' in bodyPubl.properties &&
					bodyPubl.properties.onGround === true &&
					bodyPubl.getBox()[0] > col.obj2.b[0]){
			skipY = true;
		}

		if(col.obj2.m != -1){
			var mratio = col.obj1.m / (col.obj1.m + col.obj2.m);
			bodyPriv.k.x -= overlap[0] * mratio * 1;
			nx = -1;
			if(overlap[0] === 0){nx = 1.01;}
			bodyPriv.k.vx  = nx * relvx * mratio;

			if(!skipY && !groundCollision){
				bodyPriv.k.y -= overlap[1] * mratio * 1;
				ny = -1;
				if(overlap[1] === 0){ny = 1.01;}
				bodyPriv.k.vy  = ny * relvy * mratio;
			}else if(!skipY){
				bodyPriv.k.y -= (overlap[1]);
				ny = -0.4;
				if(overlap[1] === 0){ny = 0.8;}
				bodyPriv.k.vy  = ny * relvy;
			}
		}else{
			if(!skipX){
				bodyPriv.k.x -= (overlap[0]);
				nx = -0.4;
				if(overlap[0] === 0){nx = 0.8;}
				bodyPriv.k.vx = nx * relvx;
			}
			bodyPriv.k.y -= (overlap[1]);
			ny = -0.4;
			if(overlap[1] === 0){ny = 0.8;}
			bodyPriv.k.vy  = ny * relvy;
		}

		if(col.obj1.t == 'player'){
			bodyPriv.k.vy*=0.75;
			bodyPriv.k.vx*=0.75;
		}
	}
});

		return collide;

});
