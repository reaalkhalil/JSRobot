var mozart = require('mozart');

var Behavior = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function(action) {
		_(this).action = action;
	};
	prototype.act = function(bodyPriv, bodyPubl){
		_(this).action(bodyPriv, bodyPubl);
	};
});

var gravitate = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPriv.fixed && bodyPriv.mass != -1){
		bodyPriv.k.ay += 1;
	}
});

/*
var arrowkeys = [false,false,false,false];
document.onkeydown = function myFunction() {
	if(event.keyCode<=40 && event.keyCode>=37){
		arrowkeys[event.keyCode-37] = true;
	}
};
document.onkeyup = function myFunction() {
	if(event.keyCode<=40 && event.keyCode>=37){
		arrowkeys[event.keyCode-37] = false;
	}
};

var keyboardcontrol = new Behavior(function(bodyPriv, bodyPubl){
	if(bodyPriv.fixed || bodyPriv.type != "robotc"){return;}
	// antigravity: bodyPriv.k.ay += -1;
	if(arrowkeys[0]){ bodyPriv.k.ax += -1; }
	if(arrowkeys[1]){ bodyPriv.k.ay += -2; }
	if(arrowkeys[2]){ bodyPriv.k.ax += 1; }
	if(arrowkeys[3]){ bodyPriv.k.ay += 1; }
});
*/


var agent = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPubl.isAgent()){return;}
	if(bodyPriv.properties.nextMove){
		var options = bodyPriv.properties.nextMove.split(':');
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
			var bullet = new Body({x: bodyPriv.k.x+30, y:bodyPriv.k.y+6, vx: 10, type: "bullet", t: engine.getTime()});
			bullet.addSprite(new Sprite({
				'context': context,
				x: 0,
				y: 0,
				width: 14,
				height: 10,
				destwidth: 14,
				destheight: 10,
				image: images.bullet,
			}));

			engine.add(bullet);
			//bodyPriv.engine.priv.world.push(bullet);
		}
	}
	console.log(bodyPriv.properties.energy, bodyPriv.properties.coins);
	bodyPriv.properties.nextMove = null;
	propertiesDiv.innerHTML = "Energy: " + bodyPriv.properties.energy +
							"<br>Coins: " + bodyPriv.properties.coins +
							"<br>Health: " + bodyPriv.properties.health;

});
