var mozart = require('mozart');

var agent = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPubl.isAgent()){return;}
	if(bodyPriv.properties.nextMove){
		var options = bodyPriv.properties.nextMove.split(':');
			console.log(options[0]);
		if(options[0] == "jump"){
			bodyPriv.k.ay = -15;
			bodyPriv.properties.energy -= 1;
		}else if(options[0] == "move"){
			var amount = Number(options[1]);
			if(Math.abs(amount) > 20){amount = 20 * Math.sign(amount);}
			bodyPriv.k.ax = amount;
			bodyPriv.properties.energy -= Math.abs(amount)/10;
		}else if(options[0] == "gun"){
			bodyPriv.getSprite("gun").show();
			bodyPriv.getSprite("robot").hide();
			bodyPriv.k.ax -= 0.1;
			var bullet = new Body({x: bodyPriv.k.x+35, y:bodyPriv.k.y, vx: 10, type: "bullet", mass: -1, t: engine.getTime(), lifetime: 100});
			bullet.addSprite(new Sprite({
				'context': context,
				x: 0,
				y: 0,
				width: 14,
				height: 10,
				destwidth: 14,
				destheight: 10,
				image: images.bullet
			}));

			engine.add(bullet);
			//bodyPriv.engine.priv.world.push(bullet);
		}
	}
	bodyPriv.properties.nextMove = null;
	propertiesDiv.innerHTML = "Energy: " + bodyPriv.properties.energy +
							"<br>Coins: " + bodyPriv.properties.coins +
							"<br>Health: " + bodyPriv.properties.health;

});
