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
	if('collisionProperties' in bodyPubl){
		if('spikesGoingUp' in bodyPubl.collisionProperties &&
			!bodyPubl.collisionProperties.spikesUp &&
			bodyPubl.collisionProperties.spikesGoingUp &&
			bodyPriv.getSprite){
				if(bodyPriv.getSprite('spikes').frame() > 0){
					bodyPubl.collisionProperties.spikesUp = true;
				}
		}
	}else{
		bodyPubl.collisionProperties = {spikesUp: false, spikesGoingUp: false};
	}
},
// spikes collided with something
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'player'){
			if(!bodyPubl.collisionProperties.spikesUp){
				bodyPubl.collisionProperties.spikesGoingUp = true;
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
// spikes collided with something
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'spikes'){
			if('collisionProperties' in cWith &&
			cWith.collisionProperties != null &&
			'spikesUp' in cWith.collisionProperties &&
			cWith.collisionProperties.spikesUp){
				bodyPriv.properties.health = 0;
				return false;
			}
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
// spikes collided with something
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'spikes'){
			if('collisionProperties' in cWith &&
			cWith.collisionProperties != null &&
			'spikesUp' in cWith.collisionProperties &&
			cWith.collisionProperties.spikesUp){
				bodyPriv.properties.health = 0;
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
// spikes collided with something
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'spikes'){
			if('collisionProperties' in cWith &&
			cWith.collisionProperties != null &&
			'spikesUp' in cWith.collisionProperties &&
			cWith.collisionProperties.spikesUp){
				bodyPriv.properties.health = 0;
				return false;
			}
			return true;
		}else{
			return false;
		}
	}
);


var portal = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
		if(!("collisionProperties" in bodyPubl) || bodyPubl.collisionProperties == null){
			bodyPubl.collisionProperties =
					{portalDestination: bodyPriv.collisionProperties.portalDestination};
		}
},
// spikes collided with something
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'player'){
			return true;
		}else{
			return true;
		}
	}
);


var gameObjects = {
	spikes: spikes,
	coin: coin,
	box: box,
	battery: battery,
	portal: portal,
};

return {B: Behavior, g: gravitate, o: gameObjects};
});
