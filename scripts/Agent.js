define(['mozart', 'Behavior', 'Builder', 'Body'], function (mozart, behavior, Builder, Body) {
Behavior = behavior.B;
var agent = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPubl.isAgent()){return;}
	robotSprite = bodyPriv.getSprite("robot");
	gunSprite = bodyPriv.getSprite("gun");
	deadSprite = bodyPriv.getSprite("dead");
	winSprite = bodyPriv.getSprite("win");
	if(bodyPriv.properties.health < 1 || bodyPriv.properties.energy < 1){robotSprite.hide(); gunSprite.hide();winSprite.hide(); deadSprite.show(); return;}
	if(bodyPriv.properties.win){robotSprite.hide(); gunSprite.hide(); deadSprite.hide();winSprite.show(); return;}
	if(bodyPriv.properties.nextMove){
		var options = bodyPriv.properties.nextMove.split(':');
		var turned = robotSprite.getInfo().fh?-1:1;// false: right, true: left
			if(turned<0){gunSprite.setPos(-5,0);}else{gunSprite.setPos(5,0);}
		if(options[0] == "jump"){
			if(bodyPubl.onGround()){
				bodyPriv.k.ay = -15;
				bodyPriv.properties.energy -= 1;
			}
		}else if(options[0] == "move"){
			var amount = Number(options[1]);
			if(Math.abs(amount) > 20){amount = 20 * Math.sign(amount);}
			gunSprite.hide();
			robotSprite.show();
			bodyPriv.k.ax = amount;
			bodyPriv.properties.energy -= Math.abs(amount)/10;
		}else if(options[0] == "gun"){
			gunSprite.show();
			robotSprite.hide();
			builder = bodyPriv.engine.priv.builder;
			builder.addToEngine(bodyPriv.engine.priv, "bullet",
				{x: bodyPriv.k.x + turned * 35, y:bodyPriv.k.y, vx: turned*10, t: engine.getTime()},[{r: Math.PI*(turned-1)/2}]);
		}else if(options[0] == "turn"){
			turned *= -1;
			robotSprite.fliph();
			deadSprite.fliph();
			gunSprite.fliph();
			if(turned<0){gunSprite.setPos(-5,0);}else{gunSprite.setPos(5,0);}
		}
	}
	bodyPriv.properties.nextMove = null;
	var hideGlobals = "var window=undefined;var engine=undefined;var effects=undefined;var collide=undefined;var context=undefined;";
	if(typeof newcommand !== 'undefined' && newcommand !== ""){
		bodyPubl.command(hideGlobals + newcommand);
		newcommand = "";
	}
	if(typeof newcode !== 'undefined' && newcode){
		codeString = hideGlobals + code.value+"loop(this);";
		bodyPubl.step = new Function(codeString);
		newcode = false;
	}
	propertiesDiv.innerHTML = "Energy: " + Math.round(bodyPriv.properties.energy) +
							"<br>Coins: " + bodyPriv.properties.coins +
							"<br>Health: " + Math.round(bodyPriv.properties.health) +
							"<br>X: " + Math.round(bodyPriv.k.x) +
							"<br>Y: " + Math.round(bodyPriv.k.y);
});
return agent;
});
