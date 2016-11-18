var mozart = require('mozart');

var Builder = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function(engine) {
		__(this).imageFiles =	["robot1", "robot1gun", "robot2", "coin", "wall1", "wall2", "wall3",
			   					"wall4", "wall5", "wall6", "wall7", "wall8", "wall9", "wall10", "battery",
			   					"coinpop", "batterypop", "bullet", "bulletpop"];
		__(this).images = {};
		__(this).engine = null;

		__(this).sprites = {
		player: [
		{name: "gun", x: 5, y: 0, width: 105, height: 108, destwidth: 40, destheight: 41, image: "robot1gun", visible: false},
		{name: "robot", x: 0, y: 0, width: 79, height: 108, destwidth: 30, destheight: 41, image: "robot1"}],
		coin: [{name: "coin", x: 0, y: 0, width: 120, height: 20, destwidth: 20,
			   	destheight: 20, image: "coin", numberOfFrames: 6, loop: true, ticksPerFrame: 4 }],
		battery: [{x: 0, y: 0, width: 96, height: 24, destwidth: 16, destheight: 24, image: "battery",
			   	numberOfFrames: 6, loop: true, ticksPerFrame: 4}],
		wall: [{x: 0, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: "wall1" }]
		};

		__(this).elements = {
		player: {x:0,y:0, agent:true, type: "robotc", properties: {energy: 100, coins: 0, health: 100}},
		coin: {x:0,y:0, type: "coin"},
		battery: {x: 0, y: 0, type: "battery"},
		wall: {x: 0, y: 0, fixed: true, type: "wall", mass: -1}
		};

	};

	prototype.setEngine = function(priv, publ){
		if(__(this).engine === null){
			__(this).engine = {priv: priv, publ: publ};
		}
	};

	prototype.addToEngine = function(engine, object){
		if(engine != __(this).engine){return;}
		engine.addP(object);
	};

	prototype.load = function(data){
		__(this).loadImages(data);
		__(this).build(data);
	};

	__private.loadImages = function(data){
		var total = __(this).imageFiles.length;
		var loaded = 0;
		var thiss = __(this);
		var callback = function(){
			loaded++;
			thiss.imageLoaded(loaded,total,data);
		};

		for(var img in __(this).imageFiles){
			var name = __(this).imageFiles[img];
			__(this).images[name] = new Image();
			__(this).images[name].onload = callback;
			__(this).images[name].src = "images/" + name + ".png";
		}
	};

	__private.imageLoaded = function(loaded,total,data){
		if(loaded == total){__(this).engine.priv.startP();}
	};

	__private.prepareObject = function(name, newObjOpts, newSpriteOpts){
		var objOpts = JSON.parse(JSON.stringify(__(this).elements[name]));
		for(var j in newObjOpts){
			objOpts[j] = JSON.parse(JSON.stringify(newObjOpts[j]));
		}
		var spriteOpts = JSON.parse(JSON.stringify(__(this).sprites[name]));
		objOpts.sprites = [];
		for(var i in spriteOpts){
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
		data = importeddata.elements;
		var walls = __(this).wallParser(data.walls);
		for(var w in walls){
			var wall = new Body(__(this).prepareObject("wall", {x: walls[w].x, y: walls[w].y}, [{image: walls[w].image}]));
			__(this).engine.priv.addP(wall);
		}
		for(var c in data.coins){
			var coin = new Body(__(this).prepareObject("coin", data.coins[c]));
			__(this).engine.priv.addP(coin);
		}
		for(var b in data.batteries){
			var battery = new Body(__(this).prepareObject("battery", data.batteries[b]));
			__(this).engine.priv.addP(battery);
		}
		var player = new RobotOne(__(this).prepareObject("player", data.player));
		__(this).engine.priv.addP(player);
	};

	__private.wallParser = function(walls){
		var result = [];
		var wallChars = ["#", "-", "="];
		var wallNames = ["wall10", "wall1", "wall4"];
		for(var i in walls.data){
			for(var j in walls.data[i]){
				var wallChar = walls.data[i].charAt(j);
				if(wallChar != " "){
					wallImage = wallNames[wallChars.indexOf(wallChar)];
					result.push({x: walls.origin[0] + j * 40, y: walls.origin[1] + i * 40, image: wallImage});
				}
			}
		}
		return result;
	};
});
