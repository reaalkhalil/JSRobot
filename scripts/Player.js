/*jshint esversion: 6 */
define(['mozart', 'Behavior', 'Builder', 'Body'], function (mozart, behavior, Builder, Body) {
Behavior = behavior.B;

var player = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPubl.isAgent()){return;}
	robotSprite = bodyPriv.getSprite("robot");
	gunSprite = bodyPriv.getSprite("gun");
	deadSprite = bodyPriv.getSprite("dead");
	winSprite = bodyPriv.getSprite("win");

	if(bodyPriv.properties.health < 1 || bodyPriv.properties.energy < 1){
		robotSprite.hide(); gunSprite.hide();winSprite.hide(); deadSprite.show(); return;}

	if(bodyPriv.properties.win){robotSprite.hide(); gunSprite.hide(); deadSprite.hide();winSprite.show(); return;}

	if(bodyPriv.properties.nextMove){
		var options = bodyPriv.properties.nextMove.split(':');
		var turned = robotSprite.getInfo().fh?-1:1;// false: right, true: left
			if(turned<0){gunSprite.setPos(-5,0);}else{gunSprite.setPos(5,0);}
		if(options[0] == "jump"){
			if(bodyPubl.onGround()){
				var amount = Number(options[1]);
				if(Math.abs(amount) > 10){amount = 10 * Math.sign(amount);}
				gunSprite.hide();
				robotSprite.show();
				bodyPriv.k.ax = amount/2;
				bodyPriv.k.ay = -15;
				bodyPriv.properties.energy -= (1 + Math.abs(amount)/10);
			}
		}else if(options[0] == "move"){
			if(bodyPubl.onGround()){
				var amount = Number(options[1]);
				if(Math.abs(amount) > 20){amount = 20 * Math.sign(amount);}
				gunSprite.hide();
				robotSprite.show();
				bodyPriv.k.ax = amount;
				bodyPriv.properties.energy -= Math.abs(amount)/10;
			}
		}else if(options[0] == "shoot"){
			gunSprite.show();
			robotSprite.hide();
			builder = bodyPriv.engine.priv.builder;
			builder.addToEngine(bodyPriv.engine.priv, "bullet",
				{x: bodyPriv.k.x + turned * 35,
					y: bodyPriv.k.y,
					vx: turned*10, t: engine.getTime()},[{r: Math.PI*(turned-1)/2}]);
		}else if(options[0] == "turn"){
			turned *= -1;
			robotSprite.fliph();
			deadSprite.fliph();
			gunSprite.fliph();
			if(turned<0){gunSprite.setPos(-5,0);}else{gunSprite.setPos(5,0);}
		}
	}

	bodyPriv.properties.nextMove = null;
	var hideGlobals = `var window=undefined;
		var engine=undefined;
		var effects=undefined;
		var collide=undefined;
		var context=undefined;`;

	// TODO TODO TODO: move logging stuff into its own class
	var logging = `
		outputDiv = document.getElementById('output');
		function console_output(a){
			if(outputDiv.innerHTML != ''){
				outputDiv.innerHTML += '<hr>';
			}
				outputDiv.innerHTML += a;
				outputDiv.scrollTop = outputDiv.scrollHeight;
		}
		console = {
			log: function(a,b){
				if(b == null || b == undefined){
					console_output('<b>&larr; ' + a + '</b>');
				}else{
					console_output('&rarr; ' + a + '<br><b>&larr; ' + b + '</b>');
				}
			},
			error: function(a){
				console_output('<i>' + a + '</i>');
			}
		};`;

	var scriptTail = `if(typeof(loop) == 'undefined'){
				loop = function(){}
			};
			if(typeof(init) == 'undefined'){
				init = function(){}
			};
			return {init: init, loop: loop};`;


	if(typeof newcommand !== 'undefined' && newcommand !== ""){
		var commandFn= new Function(logging + hideGlobals +
			"var robot = this; var return_output = " + newcommand +
			"\n\nreturn return_output;");

		var a = bodyPubl.command(commandFn);
		if(a.error === null){
			console.log(newcommand, a.output);
		}else{
			console.error(a.error.name + ': ' + a.error.message);
		}
		newcommand = "";
	}

	var g;
	if(typeof newcode !== 'undefined' && newcode){
		g = Function(logging + hideGlobals + editor.getValue() + scriptTail);
		g().init(bodyPubl);
		bodyPubl.playerCode = g().loop;
		newcode = false;
	}

	if(propertiesDiv.style.display != "none"){
			customProperties = [];
			customFunctions = [];
			var keys = Object.keys(bodyPubl);
			for(var key of keys){
				if(key == 'step') continue;
				if(typeof(bodyPubl[key]) == 'function'){
					customFunctions.push(key);
				}else{
					customProperties.push({key: key, value: bodyPubl[key]});
				}
			}
			customPropertiesString = "";
			for(var prop of customProperties){
				customPropertiesString += "<tr><td><b>" + prop.key + ": </b></td><td><b>" + prop.value + "</b></td></tr>";
			}
			customFunctionsString = "";
			for(prop of customFunctions){
				customFunctionsString += "<tr><td><b>" + prop + ": </b></td><td><b>[Function]</b></td></tr>";
			}

			propertiesDiv.innerHTML = "Robot = {<br><br><table>" +
			"<tr><td>energy: </td><td>" + (Math.round(bodyPriv.properties.energy * 10) / 10) + "</td></tr>" +
			"<tr><td>health: </td><td>" + (Math.round(bodyPriv.properties.health * 10) / 10) + "</td></tr>" +
			"<tr><td>coins: </td><td>" + bodyPriv.properties.coins + "</td></tr>" +
			"<tr><td>x: </td><td>" + (Math.round(bodyPriv.k.x * 10) / 10) + "</td></tr>" +
			"<tr><td>y: </td><td>" + (Math.round(bodyPriv.k.y * 10) / 10) + "</td></tr>" +
		  customPropertiesString +
			"<tr><td>&nbsp;</td><td></td></tr>" +
			"<tr><td>move: </td><td>[Function]</td></tr>" +
			"<tr><td>shoot:  </td><td>[Function]</td></tr>" +
			"<tr><td>jump: </td><td>[Function]</td></tr>" +
			"<tr><td>info: </td><td>[Function]</td></tr>" +
			"<tr><td>turn: </td><td>[Function]</td></tr>" +
			"<tr><td>init: </td><td>[Function]</td></tr>" +
			"<tr><td>loop: </td><td>[Function]</td></tr>" +
		  customFunctionsString +
		"</table><br>}";
}

});
return player;
});
