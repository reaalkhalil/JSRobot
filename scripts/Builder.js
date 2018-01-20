define(['mozart', 'Body', 'Sprite', 'Robot'], function (mozart, Body, Sprite, robot) {
RobotOne = robot.RobotOne;
var Builder = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function() {
		__(this).imageFiles =	["robot1", "robot1gun", "robot1dead", "robot1win", "robot2", "coin", "wall1", "wall2", "wall3",
			   									 "wall4", "wall5", "wall6", "wall7", "wall8", "wall9", "wall10", "battery", "coinpop", "batterypop",
													 "bullet", "sparkstrip", "spark", "bulletpop", "flag", "spikes", "box", "turret", "portal", "lift",
												 	 "enemy", "enemy-gun"];
		__(this).images = {};
		__(this).engine = null;

		__(this).sprites = {
		player: [
		{name: "gun", x: 5, y: 0, width: 105, height: 108, destwidth: 40, destheight: 41, image: "robot1gun", visible: false},
		{name: "win", x: 0, y: 0, width: 103, height: 108, destwidth: 39, destheight: 41, image: "robot1win", visible: false},
		{name: "dead", x: 0, y: 0, width: 101, height: 79, destwidth: 38, destheight: 30, image: "robot1dead", visible: false},
		{name: "robot", x: 0, y: 0, width: 79, height: 108, destwidth: 30, destheight: 41, image: "robot1"}],
		coin: [{name: "coin", x: 0, y: 0, width: 120, height: 20, destwidth: 20,
			   	destheight: 20, image: "coin", numberOfFrames: 6, loop: true, ticksPerFrame: 4 }],
		battery: [{x: 0, y: 0, width: 96, height: 24, destwidth: 16, destheight: 24, image: "battery",
			   	numberOfFrames: 6, loop: true, ticksPerFrame: 4}],
		wall: [{x: 0, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: "wall1" }],
		sparkstrip: [{x: 0, y: 0, width: 84, height: 5, destwidth: 70, destheight: 12.5, image: "sparkstrip", numberOfFrames: 3, loop: true, ticksPerFrame: 2 }],
		bullet: [{x: 0, y: 0, width: 14, height: 10, destwidth: 14, destheight: 10, image: "bullet" }],
		spikes: [{name: "spikes", x: 0, y: 0, width: 150, height: 12, destwidth: 40,
			   	destheight: 15, image: "spikes", numberOfFrames: 3, loop: false, ticksPerFrame: 4, paused: true }],
		turret: [{name: "turret", x: 0, y: 0, width: 14, height: 12, destwidth: 28,
			   	destheight: 24, image: "turret" }],
		lift: [{name: "lift", x: 0, y: 0, width: 40, height: 15, destwidth: 40,
			   	destheight: 15, image: "lift" }],
		enemy: [{name: "enemy", x: 0, y: 0, width: 82, height: 108, destwidth: 30,
			   	destheight: 40, image: "enemy" }],
		gunEnemy: [{name: "gunEnemy", x: 0, y: 0, width: 92, height: 108, destwidth: 34,
			   	destheight: 40, image: "enemy-gun" }],
		box: [{name: "box", x: 0, y: 0, width: 50, height: 50, destwidth: 40,
			   	destheight: 40, image: "box" }],
		portal: [{x: 0, y: 0, width: 12, height: 47, destwidth: 4, destheight: 47, image: "portal", numberOfFrames: 3, loop: true, ticksPerFrame: 4 }],
		flag: [{x: 0, y: 0, width: 50, height: 11, destwidth: 30, destheight: 33, image: "flag", numberOfFrames: 5, loop: true, ticksPerFrame: 4 }]
		};

		__(this).elements = {
		player: {x:0,y:0, agent:true, type: "player", properties: {energy: 100, coins: 0, health: 100}},
		coin: {x:0,y:0, type: "coin"},
		battery: {x: 0, y: 0, type: "battery"},
		wall: {x: 0, y: 0, fixed: true, type: "wall", mass: -1},
		sparkstrip: {x: 0, y: 0, fixed: true, type: "sparkstrip", mass: -1},
		spikes: {x: 0, y: 0, type: "spikes", mass: -1},
		box: {x: 0, y: 0, type: "box"},
		portal: {x: 0, y: 0, type: "portal", mass: -1},
		turret: {x: 0, y: 0, type: "turret", mass: -1},
		lift: {x: 0, y: 0, type: "lift", mass: -1},
		enemy: {x: 0, y: 0, type: "enemy"},
		gunEnemy: {x: 0, y: 0, type: "gunEnemy"},
		bullet: {x: 0, y: 0, vx: 10, type: "bullet", mass: 0, lifetime: 500},
		flag: {x: 0, y: 0, fixed: true, type: "flag", mass: -1}
		};

	};

	prototype.setEngine = function(priv, publ){
		if(__(this).engine === null){
			__(this).engine = {priv: priv, publ: publ};
		}
	};

	prototype.addToEngine = function(engine, name, newObjOpts, newSpriteOpts){
		if(engine != __(this).engine.priv){return;}
		var object = new Body(__(this).prepareObject(name, newObjOpts, newSpriteOpts));
		engine.add(object);
	};

	prototype.load = function(data){
		__(this).loadImages();
		__(this).build(data);
	};

	__private.loadImages = function(){
		var total = __(this).imageFiles.length;
		var loaded = 0;
		var that = __(this);
		var callback = function(){
			loaded++;
			that.imageLoaded(loaded,total);
		};

		for(var img in __(this).imageFiles){
			var name = __(this).imageFiles[img];
			__(this).images[name] = new Image();
			__(this).images[name].onload = callback;
			__(this).images[name].src = "images/" + name + ".png";
		}
	};

	__private.imageLoaded = function(loaded,total){
		if(loaded == total){__(this).engine.priv.start();}
	};

	__private.prepareObject = function(name, newObjOpts, newSpriteOpts){
		var objOpts = JSON.parse(JSON.stringify(__(this).elements[name]));
		for(var j in newObjOpts){
			objOpts[j] = JSON.parse(JSON.stringify(newObjOpts[j]));
		}
		var spriteOpts = JSON.parse(JSON.stringify(__(this).sprites[name]));
		objOpts.sprites = [];
		if(!newSpriteOpts){newSpriteOpts = [];}
		spriteNum = Math.max(spriteOpts.length, newSpriteOpts.length);
		for(var i = 0; i < spriteNum; i++){
			if(i >= spriteOpts.length){spriteOpts.push(JSON.parse(JSON.stringify(spriteOpts[0])));}
			spriteOpts[i].context = context;
			if(newSpriteOpts && i < newSpriteOpts.length){
				for(var q in newSpriteOpts[i]){
					spriteOpts[i][q] = newSpriteOpts[i][q];
				}
			}
			spriteOpts[i].image = __(this).images[spriteOpts[i].image];
			objOpts.sprites.push(new Sprite(spriteOpts[i]));
		}
		return objOpts;
	};

	__private.build = function(data){
		var result = [];
		var walls = __(this).wallParser(data.walls);
		for(var w in walls){
			var wall = new Body(__(this).prepareObject("wall", {x: walls[w].x, y: walls[w].y, fixed: true}, walls[w].sprites));
			__(this).engine.priv.add(wall);
		}
		for(var c in data.coins){
			var coin = new Body(__(this).prepareObject("coin", data.coins[c]));
			__(this).engine.priv.add(coin);
		}
		for(var b in data.batteries){
			var battery = new Body(__(this).prepareObject("battery", data.batteries[b]));
			__(this).engine.priv.add(battery);
		}
		for(var s in data.sparkstrips){
			var sparkstrip = new Body(__(this).prepareObject("sparkstrip", data.sparkstrips[s]));
			__(this).engine.priv.add(sparkstrip);
		}
		for(var l in data.enemies){
			var enemy = new Body(__(this).prepareObject("enemy", data.enemies[l]));
			__(this).engine.priv.add(enemy);
		}
		for(var g in data.gunEnemies){
			var gunEnemy = new Body(__(this).prepareObject("gunEnemy", data.gunEnemies[g]));
			__(this).engine.priv.add(gunEnemy);
		}
		for(var f in data.lifts){
			var lift = new Body(__(this).prepareObject("lift", data.lifts[f]));
			__(this).engine.priv.add(lift);
		}
		for(var t in data.turrets){
			var turret = new Body(__(this).prepareObject("turret", data.turrets[t]));
			__(this).engine.priv.add(turret);
		}
		for(var x in data.boxes){
			var box = new Body(__(this).prepareObject("box", data.boxes[x]));
			__(this).engine.priv.add(box);
		}
		for(var p in data.portals){
			var spriteProperties = null;
			if ('spriteProperties' in data.portals[p]) {
				spriteProperties = data.portals[p].spriteProperties;
			}
			var portal = new Body(__(this).prepareObject("portal", data.portals[p], spriteProperties));
			__(this).engine.priv.add(portal);
		}
		for(var k in data.spikes){
			var spikes = new Body(__(this).prepareObject("spikes", data.spikes[k]));
			__(this).engine.priv.add(spikes);
		}
		var flag = new Body(__(this).prepareObject("flag", data.flag));
		__(this).engine.priv.add(flag);

		var player = new RobotOne(__(this).prepareObject("player", data.player));
		__(this).engine.priv.add(player);

		__(this).engine.priv.add(effects);

effects.addEffect("bulletpop",new Sprite({
	'context': context,
	name: "bulletpop",
	x: 0,
	y: 0,
	width: 36,
	height: 9,
	destwidth: 20,
	destheight: 20,
	image: __(this).images.bulletpop,
	numberOfFrames: 4,
	visible: false,
	ticksPerFrame: 1
}));

effects.addEffect("coinpop",new Sprite({
	'context': context,
	name: "coinpop",
	x: 0,
	y: 0,
	width: 36,
	height: 14,
	destwidth: 18,
	destheight: 28,
	image: __(this).images.coinpop,
	numberOfFrames: 4,
	visible: false,
	ticksPerFrame: 2
}));

effects.addEffect("batterypop",new Sprite({
	'context': context,
	name: "batterypop",
	x: 0,
	y: 0,
	width: 36,
	height: 14,
	destwidth: 18,
	destheight: 28,
	image: __(this).images.batterypop,
	numberOfFrames: 4,
	visible: false,
	ticksPerFrame: 2
}));

effects.addEffect("spark",new Sprite({
	'context': context,
	name: "spark",
	x: 0,
	y: 0,
	width: 48,
	height: 11,
	destwidth: 36,
	destheight: 33,
	image: __(this).images.spark,
	numberOfFrames: 4,
	visible: false,
	ticksPerFrame: 2
}));



	};

	__private.wallParser = function(walls){
		var result = [];
		var wallTypes = [
			{
				char: "#",
			 	images: ["wall10"],
		 		r: 0
			},{
				char: "-",
			 	images: ["wall1", "wall2", "wall3"],
		 		r: 0
			},{
				char: "_",
			 	images: ["wall1", "wall2", "wall3"],
		 		r: 1
			},{
				char: ">",
			 	images: ["wall4"],
		 		r: 0
			},{
				char: "<",
			 	images: ["wall4"],
		 		r: 1
			},{
				char: "^",
			 	images: ["wall4"],
		 		r: 1/2
			},{
				char: "v",
			 	images: ["wall4"],
		 		r: 3/2
			},{
				char: "|",
			 	images: ["wall1", "wall2", "wall3"],
		 		r: 1/2
			},{
				char: "/",
			 	images: ["wall1", "wall2", "wall3"],
		 		r: 3/2
			},{
				char: ".",
			 	images: ["wall5"],
		 		r: 1/2
			},{
				char: "'",
			 	images: ["wall5"],
		 		r: 3/2
			},{
				char: "`",
			 	images: ["wall5"],
		 		r: 1
			},{
				char: ",",
			 	images: ["wall5"],
		 		r: 0
			}
		];

	function filterChars(a) {
		if(a.char == wallChar){
			return a;
		}
	}

		for(var i in walls.data){
			var start = 0;
			var spritesHolder = [];
			walls.data[i]+=" ";
			for(var j in walls.data[i]){
				var wallChar = walls.data[i].charAt(j);
				var prevChar = walls.data[i].charAt(j-1);
				if(wallChar != " " && wallChar !== ""){
					if(prevChar == " " || prevChar === ""){start = j;}
					wallType = wallTypes.filter(filterChars)[0];
					var wallImage = wallType.images[Math.floor(Math.random() * wallType.images.length)];
					var wallRotation = Math.PI * wallType.r;
					spritesHolder.push({x: 40*(j-start), y: 0, image: wallImage, r: wallRotation});
				}else if((wallChar == " " || wallChar === "") && prevChar != " " && prevChar !== ""){
					result.push({x: walls.origin[0] + start * 40,
						   y: walls.origin[1] + i * 40,
						   	sprites: spritesHolder});
					spritesHolder = [];
				}
			}
		}
		return result;
	};
});

return Builder;
});
