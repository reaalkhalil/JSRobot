define(["mozart"],function (mozart) {

var Behavior = mozart(function(prototype, _, _protected, __, __private) {
	prototype.collideBehavior = false;

	prototype.init = function(action, collide) {
		_(this).action = action;
		if(collide !== null){
			prototype.collideBehavior = true;
			_(this).collide = collide;
		}
	};

	prototype.act = function(bodyPriv, bodyPubl){
		_(this).action(bodyPriv, bodyPubl);
	};

	prototype.collideWith = function(bodyPriv, bodyPubl, cWith){
		return _(this).collide(bodyPriv, bodyPubl, cWith);
	};

});



var gravitate = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPriv.fixed && bodyPriv.mass != -1 && bodyPriv.type != 'bullet'){
		bodyPriv.k.ay += 1;
	}
});

/////////////////////           SPIKES           /////////////////////////////
var spikes = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
	if('properties' in bodyPubl){
		if('spikesGoingUp' in bodyPubl.properties &&
			!bodyPubl.properties.spikesUp &&
			bodyPubl.properties.spikesGoingUp &&
			bodyPriv.getSprite){
				if(bodyPriv.getSprite('spikes').frame() == bodyPriv.getSprite('spikes').lastframe()){
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

/////////////////////           COIN           /////////////////////////////
var coin = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'portal')
		{
			if('properties' in cWith &&
				cWith.properties !== null &&
				'portalDestination' in cWith.properties &&
				cWith.properties.portalDestination !== null){
					var a = cWith.properties.portalDestination;
					var d = cWith.properties.portalDestination.d;

					var oldDX = bodyPriv.k.x - cWith.k.x;
					if(oldDX * ((d%2) * ((d==3)?(-1):(1))) > 0){
					bodyPriv.k.vx *= -1;
					}
					bodyPriv.k.x = a.x + (d%2) * 20 *((d==3)?(-1):(1));
					bodyPriv.k.y = a.y + ((d+1)%2) * 20 *((d===0)?(-1):(1));

					bodyPriv.k.vy = 0;
					bodyPriv.k.vx = 0;
					bodyPriv.toBeDestroyed = false;
					return true;
			}
			return true;
		}
		if(cWith.t == 'spikes'){
			if('properties' in cWith &&
			cWith.properties !== null &&
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

/////////////////////           BOX           /////////////////////////////
var box = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
},
// collision
	function(bodyPriv, bodyPubl, cWith){

		if(cWith.t == 'portal')
		{
			if('properties' in cWith &&
				cWith.properties !== null &&
				'portalDestination' in cWith.properties &&
				cWith.properties.portalDestination !== null){
					var a = cWith.properties.portalDestination;
					var d = cWith.properties.portalDestination.d;

					var oldDX = bodyPriv.k.x - cWith.k.x;
					if(oldDX * ((d%2) * ((d==3)?(-1):(1))) > 0){
						bodyPriv.k.vx *= -1;
					}
					bodyPriv.k.x = a.x + (d%2) * 40 *((d==3)?(-1):(1));
					bodyPriv.k.y = a.y + ((d+1)%2) * 40 *((d===0)?(-1):(1));

					bodyPriv.k.vy = 0;
					bodyPriv.toBeDestroyed = false;
					return true;
			}
			return true;
		}
		if(cWith.t == 'spikes'){
			if('properties' in cWith &&
			cWith.properties !== null &&
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

/////////////////////           BATTERY           /////////////////////////////
var battery = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'portal')
		{
			if('properties' in cWith &&
				cWith.properties !== null &&
				'portalDestination' in cWith.properties &&
				cWith.properties.portalDestination !== null){
					var a = cWith.properties.portalDestination;
					var d = cWith.properties.portalDestination.d;

					var oldDX = bodyPriv.k.x - cWith.k.x;
					if(oldDX * ((d%2) * ((d==3)?(-1):(1))) > 0){
						bodyPriv.k.vx *= -1;
					}
					bodyPriv.k.x = a.x + (d%2) * 20 *((d==3)?(-1):(1));
					bodyPriv.k.y = a.y + ((d+1)%2) * 20 *((d===0)?(-1):(1));

					bodyPriv.k.vy = 0;
					bodyPriv.toBeDestroyed = false;
					return true;
			}
			return true;
		}
		if(cWith.t == 'spikes'){
			if('properties' in cWith &&
			cWith.properties !== null &&
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


/////////////////////           PORTAL           /////////////////////////////
var portal = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
		if(!("properties" in bodyPubl) || bodyPubl.properties === null){
			bodyPubl.properties =
					{portalDestination: bodyPriv.properties.portalDestination};
		}else{
			bodyPubl.properties.portalDestination = bodyPriv.properties.portalDestination;
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


/////////////////////           BULLET           /////////////////////////////
var bullet = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
},
// collision
	function(bodyPriv, bodyPubl, cWith){

		if(cWith.t == 'portal')
		{
			if('properties' in cWith &&
				cWith.properties !== null &&
				'portalDestination' in cWith.properties &&
				cWith.properties.portalDestination !== null){

					if(bodyPriv.toBeDestroyed === true){return true;}

					var a = cWith.properties.portalDestination;
					var d = cWith.properties.portalDestination.d;

					var oldDX = bodyPriv.k.x - cWith.k.x;

					var rotation = (((d==3) ? 0 : 1) + Math.sign(bodyPriv.k.vx)) * Math.PI;

					if(oldDX * ((d%2) * ((d==3)?(-1):(1))) >= 0){
						builder = bodyPriv.engine.priv.builder;
						builder.addToEngine(bodyPriv.engine.priv, "bullet",
							{x: a.x + (d%2) * 15 * ((d==3)?(-1):(1)),
								y: a.y,
								vx: -bodyPriv.k.vx,
								t: engine.getTime()},
							[{r: rotation}]);
					}else{
						builder = bodyPriv.engine.priv.builder;
						builder.addToEngine(bodyPriv.engine.priv, "bullet",
							{x: a.x + (d%2) * 15 * ((d==3)?(-1):(1)),
								y: a.y,
								vx: bodyPriv.k.vx,
								t: engine.getTime()},
							[{r: rotation}]);
					}

					bodyPriv.lifetime = 1;
					bodyPriv.k.vy = 0;
					bodyPriv.toBeDestroyed = true;
					return true;
			}
			bodyPriv.toBeDestroyed = true;
			return true;
		}
		if(cWith.t == 'spikes'){
			if('properties' in cWith &&
			cWith.properties !== null &&
			'spikesUp' in cWith.properties &&
			cWith.properties.spikesUp){
			}else{
			return true;
			}
		}
		effects.play("bulletpop", {x: bodyPriv.k.x, y: bodyPriv.k.y});
		bodyPriv.k.vx = 0;
		bodyPriv.toBeDestroyed = true;
		return true;
	}
);

/////////////////////           LIFT           /////////////////////////////
var lift = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
		if(!('properties' in bodyPriv)){
			bodyPriv.properties = {};
		}
		if(!('x1' in bodyPriv.properties)){
			bodyPriv.properties.x1 = bodyPriv.k.x;
			bodyPriv.properties.y1 = bodyPriv.k.y;
			bodyPriv.properties.at = 1;
		}
		var v = bodyPriv.properties.v;
		var vel = 1;
		var xd, yd;
		if(bodyPriv.properties.at == 1){
			if(Math.abs(bodyPriv.properties.y2 - bodyPriv.k.y) < 2*v &&
				Math.abs(bodyPriv.properties.x2 - bodyPriv.k.x) < 2*v){
				bodyPriv.properties.at = 2;
			}
			yd = bodyPriv.properties.y2 - bodyPriv.k.y;
			xd = bodyPriv.properties.x2 - bodyPriv.k.x;
			bodyPriv.k.vy = v * (Math.abs(yd) < v) ? 0 : Math.sign(yd);
			bodyPriv.k.vx = v * (Math.abs(xd) < v) ? 0 : Math.sign(xd);
		}else if(bodyPriv.properties.at == 2){
			if(Math.abs(bodyPriv.properties.y1 - bodyPriv.k.y) < 2*v &&
				Math.abs(bodyPriv.properties.x1 - bodyPriv.k.x) < 2*v){
				bodyPriv.properties.at = 1;
			}
			yd = bodyPriv.properties.y1 - bodyPriv.k.y;
			xd = bodyPriv.properties.x1 - bodyPriv.k.x;
			bodyPriv.k.vy = v * (Math.abs(yd) < v) ? 0 : Math.sign(yd);
			bodyPriv.k.vx = v * (Math.abs(xd) < v) ? 0 : Math.sign(xd);
		}
	},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'portal')
		{
			if('properties' in cWith &&
				cWith.properties !== null &&
				'portalDestination' in cWith.properties &&
				cWith.properties.portalDestination !== null){
					if(bodyPriv.justTeleported === true){
						bodyPriv.justTeleported = false;
						return;
					}

					var a = cWith.properties.portalDestination;
					var d = cWith.properties.portalDestination.d;

					var oldDX = bodyPriv.k.x - cWith.k.x;
					if(oldDX * ((d%2) * ((d==3)?(-1):(1))) > 0){
						bodyPriv.k.vx *= -1;
					}
					bodyPriv.k.x += (a.x -cWith.k.x + (d%2) * 45 *((d==3)?(-1):(1)));
					bodyPriv.k.y += (a.y -cWith.k.y + ((d+1)%2) * 45 *((d===0)?(-1):(1)));
					bodyPriv.justTeleported = true;
					return true;
			}
			return true;
		}
		return true;
	}
);
/////////////////////           ENEMY           /////////////////////////////
var enemy = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
		if(!("properties" in bodyPriv) || bodyPriv.properties === null){
			bodyPriv.properties =
					{health: 100, dead: false};
		}

		if(!("properties" in bodyPubl) || bodyPubl.properties === null){
				bodyPubl.properties = {health: 100, dead: false};
		}

		bodyPubl.properties.health = bodyPriv.properties.health;
		bodyPubl.properties.dead = bodyPriv.properties.dead;
		if(bodyPriv.properties.dead === true){return;}

		if(!('x1' in bodyPriv.properties)){
			bodyPriv.properties.x1 = bodyPriv.k.x;
			bodyPriv.properties.at = 1;
			bodyPriv.properties.health = 100;
			bodyPriv.properties.dead = false;
		}
		var v = bodyPriv.properties.v;
		if(bodyPriv.properties.at == 1){
			if(Math.abs(bodyPriv.properties.x2 - bodyPriv.k.x) < 2*v){
				bodyPriv.properties.at = 2;
				bodyPriv.getSprite('enemy').fliph();
				//return;
			}
		bodyPriv.k.vx = v * Math.sign(bodyPriv.properties.x2 - bodyPriv.k.x);
		}else if(bodyPriv.properties.at == 2){
			if(Math.abs(bodyPriv.properties.x1 - bodyPriv.k.x) < 2*v){
				bodyPriv.properties.at = 1;
				bodyPriv.getSprite('enemy').fliph();
				//return;
			}
		bodyPriv.k.vx = v * Math.sign(bodyPriv.properties.x1 - bodyPriv.k.x);
		}
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'bullet'){
			if(bodyPriv.properties.health <= 0 && bodyPriv.properties.dead === false){
				bodyPriv.properties.dead = true;
				builder.addToEngine(bodyPriv.engine.priv, "coin",
					{x: bodyPriv.k.x,
					 y: bodyPriv.k.y-30,
					 t: engine.getTime()},[]);
				 }
			if(bodyPriv.properties.health <= 0){
				effects.play("spark",{x: bodyPriv.k.x, y: bodyPriv.k.y});
			}else{
				bodyPriv.properties.health -= 10;
			}
			return false;
		}else{
			return false;
		}
	}
);


/////////////////////           GUN ENEMY           /////////////////////////////
var gunEnemy = new Behavior(
	//action
	function(bodyPriv, bodyPubl){


		if(!("properties" in bodyPriv) ||
			bodyPriv.properties === null){
			bodyPriv.properties = {tick: 0, turned: false};
		}

			if(!('turned' in bodyPriv.properties)){
				bodyPriv.properties.turned = false;
			}
			if(!('tick' in bodyPriv.properties)){
				bodyPriv.properties.tick = 0;
			}
			if(typeof(bodyPriv.properties.turned) == 'boolean'){
				if(bodyPriv.properties.turned === true){
					bodyPriv.getSprite('gun-robot').fliph();
					bodyPriv.properties.turned = 1;
				}else{
					bodyPriv.properties.turned = -1;
				}
			}
			turned = bodyPriv.properties.turned;

		if(bodyPriv.properties.tick++ == bodyPriv.properties.shootingRate &&
				bodyPriv.properties.dead === false){
				builder = bodyPriv.engine.priv.builder;
				builder.addToEngine(bodyPriv.engine.priv, "bullet",
					{x: bodyPriv.k.x + turned * 25,
					 y: bodyPriv.k.y,
					 vx: turned*10, t: engine.getTime()},[{r: Math.PI*(turned-1)/2}]);
				bodyPriv.properties.tick = 0;
		}


		if(!("properties" in bodyPriv) || bodyPriv.properties === null){
			bodyPriv.properties =
					{health: 100, dead: false};
		}

		if(!("properties" in bodyPubl) || bodyPubl.properties === null){
				bodyPubl.properties = {health: 100, dead: false};
		}

		bodyPubl.properties.health = bodyPriv.properties.health;
		bodyPubl.properties.dead = bodyPriv.properties.dead;
		if(bodyPriv.properties.dead === true){return;}

		if(!('x1' in bodyPriv.properties)){
			bodyPriv.properties.x1 = bodyPriv.k.x;
			bodyPriv.properties.at = 1;
			bodyPriv.properties.health = 100;
			bodyPriv.properties.dead = false;
		}
		var v = bodyPriv.properties.v;
		if(bodyPriv.properties.at == 1){
			if(Math.abs(bodyPriv.properties.x2 - bodyPriv.k.x) < 2*v){
				bodyPriv.properties.at = 2;
				bodyPriv.getSprite('gunEnemy').fliph();
				bodyPriv.properties.turned *= -1;
				//return;
			}
		bodyPriv.k.vx = v * Math.sign(bodyPriv.properties.x2 - bodyPriv.k.x);
		}else if(bodyPriv.properties.at == 2){
			if(Math.abs(bodyPriv.properties.x1 - bodyPriv.k.x) < 2*v){
				bodyPriv.properties.at = 1;
				bodyPriv.getSprite('gunEnemy').fliph();
				bodyPriv.properties.turned *= -1;
				//return;
			}
		bodyPriv.k.vx = v * Math.sign(bodyPriv.properties.x1 - bodyPriv.k.x);
		}
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		if(cWith.t == 'bullet'){
			if(bodyPriv.properties.health <= 0 && bodyPriv.properties.dead === false){
				bodyPriv.properties.dead = true;
				builder.addToEngine(bodyPriv.engine.priv, "coin",
					{x: bodyPriv.k.x,
					 y: bodyPriv.k.y-30,
					 t: engine.getTime()},[]);
				 }
			if(bodyPriv.properties.health <= 0){
				effects.play("spark",{x: bodyPriv.k.x, y: bodyPriv.k.y});
			}else{
				bodyPriv.properties.health -= 10;
			}
			return false;
		}else{
			return false;
		}
	}
);

/////////////////////           TURRET           /////////////////////////////
var turret = new Behavior(
	//action
	function(bodyPriv, bodyPubl){
		if(!("properties" in bodyPriv) ||
			bodyPriv.properties === null){
			bodyPriv.properties = {tick: 0};
		}

			if(!('tick' in bodyPriv.properties)){
				bodyPriv.properties.tick = 0;
			}
			if(typeof(bodyPriv.properties.turned) == 'boolean'){
				if(bodyPriv.properties.turned === true){
					bodyPriv.getSprite('turret').fliph();
					bodyPriv.properties.turned = 1;
				}else{
					bodyPriv.properties.turned = -1;
				}
			}
			turned = bodyPriv.properties.turned;

		if(bodyPriv.properties.tick++ == bodyPriv.properties.shootingRate){
				builder = bodyPriv.engine.priv.builder;
				builder.addToEngine(bodyPriv.engine.priv, "bullet",
					{x: bodyPriv.k.x + turned * 25,
					 y: bodyPriv.k.y-6,
					 vx: turned*10, t: engine.getTime()},[{r: Math.PI*(turned-1)/2}]);
				bodyPriv.properties.tick = 0;
		}
},
// collision
	function(bodyPriv, bodyPubl, cWith){
		return true;
	}
);



var gameObjects = {
	spikes: spikes,
	coin: coin,
	box: box,
	battery: battery,
	portal: portal,
	bullet: bullet,
	lift: lift,
	turret: turret,
	enemy: enemy,
	gunEnemy: gunEnemy
};

return {B: Behavior, g: gravitate, o: gameObjects};
});
