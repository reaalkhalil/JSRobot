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

var gameObjects = {
	spikes: spikes,
};

return {B: Behavior, g: gravitate, o: gameObjects};
});
