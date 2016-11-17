var mozart = require('mozart');

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
			var k1 = obj1.getK(), b1 = obj1.getBox(), m1 = obj1.getMass(), t1 = obj1.getType();
			var b1a = [b1[0] + k1.vy, b1[1] + k1.vx, b1[2] + k1.vy, b1[3] + k1.vx];

			for(var j = i + 1; j < world.length; j++){
				var obj2 = world[j];
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

					
				__(this).pairs.push({
					overlap: overlap,
					obj1: {obj: obj1, k: k1, b: b1, m: m1, t: t1},
					obj2: {obj: obj2, k: k2, b: b2, m: m2, t: t2}
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


// make a collect object same as this for coins
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

		if(bodyPubl.isAgent() && col.obj2.t == "battery"){
			if(isNaN(bodyPriv.properties.energy)){
				bodyPriv.properties.energy = 0;
			}
			bodyPriv.properties.energy = 100;
			continue;
		}else if(bodyPriv.type == "battery" && ( col.obj2.t == "robot" ||  col.obj2.t == "robotc")){
			effects.play("batterypop",{x:bodyPriv.k.x, y:bodyPriv.k.y});
			bodyPriv.toBeDestroyed = true;
			continue;
		}
		if(bodyPubl.isAgent() && col.obj2.t == "coin"){
			if(isNaN(bodyPriv.properties.coins)){
				bodyPriv.properties.coins = 0;
			}
			bodyPriv.properties.coins += 1;
			continue;
		}else if(bodyPriv.type == "coin" && ( col.obj2.t == "robot" ||  col.obj2.t == "robotc")){
			effects.play("coinpop",{x: bodyPriv.k.x, y: bodyPriv.k.y});
			bodyPriv.toBeDestroyed = true;
			continue;
		}
		var k1 = col.obj1.k;
		var k2 = col.obj2.k;
		var overlap = col.overlap;

		var relvx = k1.vx - k2.vx;
		var relvy = k1.vy - k2.vy;

		if(col.obj2.m != -1){
			var mratio = col.obj1.m / (col.obj1.m + col.obj2.m);
			bodyPriv.k.x -= overlap[0] * mratio * 0.4;
			bodyPriv.k.y -= overlap[1] * mratio * 0.4;
			nx = -1;
			ny = -1;
			if(overlap[0] === 0){nx = 1;}
			if(overlap[1] === 0){ny = 1;}
			bodyPriv.k.vx  = nx * relvx * mratio;
			bodyPriv.k.vy  = ny * relvy * mratio;
		}else{
			bodyPriv.k.x -= (overlap[0]*0.4);
			bodyPriv.k.y -= (overlap[1]*0.4);
			nx = -0.5;
			ny = -0.5;
			if(overlap[0] === 0){nx = 0.9;}
			if(overlap[1] === 0){ny = 0.9;}
			bodyPriv.k.vx  = nx * relvx;
			bodyPriv.k.vy  = ny * relvy;
		}
		if(Math.abs(col.obj2.b[0] - col.obj1.b[2]) < 3){
			bodyPriv.onGround = true;
		}

		//bodyPriv.k.x = Math.ceil(bodyPriv.k.x*10)/10;
		//bodyPriv.k.y = Math.ceil(bodyPriv.k.y*10)/10;
		if(Math.abs(bodyPriv.k.vx)<=0.2){bodyPriv.k.vx=0;}
		if(Math.abs(bodyPriv.k.vy)<=0.2){bodyPriv.k.vy=0;}
	}
});


