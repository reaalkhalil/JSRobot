define(['mozart', 'Behavior', 'Builder', 'Body'], function (mozart, behavior, Builder, Body) {
Behavior = behavior.B;
var agent = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPubl.isAgent()){return;}
	if(bodyPriv.properties.nextMove){
		var options = bodyPriv.properties.nextMove.split(':');
		if(options[0] == "jump"){
			if(bodyPubl.onGround()){
				bodyPriv.k.ay = -15;
				bodyPriv.properties.energy -= 1;
			}
		}else if(options[0] == "move"){
			var amount = Number(options[1]);
			if(Math.abs(amount) > 20){amount = 20 * Math.sign(amount);}
			bodyPriv.k.ax = amount;
			bodyPriv.properties.energy -= Math.abs(amount)/10;
		}else if(options[0] == "gun"){
			bodyPriv.getSprite("gun").show();
			bodyPriv.getSprite("robot").hide();
			bodyPriv.k.ax -= 0.1;
			// do this using Builder:
			builder = bodyPriv.engine.priv.builder;
			builder.addToEngine(bodyPriv.engine.priv, "bullet", {x: bodyPriv.k.x+35, y:bodyPriv.k.y, t: engine.getTime()});
		}
	}
	bodyPriv.properties.nextMove = null;
	if(newcommand){
		bodyPubl.command(newcommand);
		newcommand = "";
	}else if(newcode){
		codeString = code.value+"\nloop(this);";
		bodyPubl.step = new Function(codeString);
		newcode = false;
	}
	propertiesDiv.innerHTML = "Energy: " + bodyPriv.properties.energy +
							"<br>Coins: " + bodyPriv.properties.coins +
							"<br>Health: " + bodyPriv.properties.health;

});
return agent;
});
