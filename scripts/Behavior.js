define(["mozart"],function (mozart) {

var Behavior = mozart(function(prototype, _, _protected, __, __private) {
	prototype.collideBehavior = false;

	prototype.init = function(action, collide) {
		_(this).action = action;
		if(collide != null){
			prototype.collideBehavior = true;
			_(this).collide = collide;
		}
	};

	prototype.act = function(bodyPriv, bodyPubl){
		_(this).action(bodyPriv, bodyPubl);
	};

	prototype.collideWith = function(bodyPriv, bodyPubl, cWith){
		return _(this).collide(bodyPriv, bodyPubl, cWith);
	}

});



var gravitate = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPriv.fixed && bodyPriv.mass != -1){
		bodyPriv.k.ay += 1;
	}
});

var spikes = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
	if('properties' in bodyPubl){
		if('spikesGoingUp' in bodyPubl.properties &&
			!bodyPubl.properties.spikesUp &&
			bodyPubl.properties.spikesGoingUp &&
			bodyPriv.getSprite){
				if(bodyPriv.getSprite('spikes').frame() > 0){
					bodyPubl.properties.spikesUp = true;
				}
		}
	}else{
		bodyPubl.properties = {spikesUp: false, spikesGoingUp: false};
	}
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'player'){
			if(!bodyPubl.properties.spikesUp){
				bodyPubl.properties.spikesGoingUp = true;
				bodyPriv.getSprite('spikes').rewind();
				bodyPriv.getSprite('spikes').play();
			}
			return true;
		}else{
			return true;
		}
	}
);

var coin = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'spikes'){
			if('properties' in cWith &&
			cWith.properties != null &&
			'spikesUp' in cWith.properties &&
			cWith.properties.spikesUp){
				return false;
			}
			return true;
		}else if(cWith.t == 'player'){
			effects.play("coinpop",{x: bodyPriv.k.x, y: bodyPriv.k.y});
			bodyPriv.toBeDestroyed = true;
			return true;
		}else{
			return false;
		}
	}
);

var box = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'spikes'){
			if('properties' in cWith &&
			cWith.properties != null &&
			'spikesUp' in cWith.properties &&
			cWith.properties.spikesUp){
				return false;
			}
			return true;
		}else{
			return false;
		}
	}
);

var battery = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'spikes'){
			if('properties' in cWith &&
			cWith.properties != null &&
			'spikesUp' in cWith.properties &&
			cWith.properties.spikesUp){
				return false;
			}
			return true;
		}else if(cWith.t == 'player'){
			effects.play("batterypop",{x:bodyPriv.k.x, y:bodyPriv.k.y});
			bodyPriv.toBeDestroyed = true;
			return true;
		}else{
			return false;
		}
	}
);


var portal = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
		if(!("properties" in bodyPubl) || bodyPubl.properties == null){
			bodyPubl.properties =
					{portalDestination: bodyPriv.properties.portalDestination};
		}
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'player'){
			return true;
		}else{
			return true;
		}
	}
);


var bullet = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'spikes'){
			if('properties' in cWith &&
			cWith.properties != null &&
			'spikesUp' in cWith.properties &&
			cWith.properties.spikesUp){
			}else{
			return true;
			}
		}
		effects.play("bulletpop",{x: bodyPriv.k.x + 15 * Math.sign(bodyPriv.k.vx), y: bodyPriv.k.y});
		bodyPriv.toBeDestroyed = true;
		return true;
	}
);


var gameObjects = {
	spikes: spikes,
	coin: coin,
	box: box,
	battery: battery,
	portal: portal,
	bullet: bullet
};

return {B: Behavior, g: gravitate, o: gameObjects};
});
