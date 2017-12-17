/*jshint esversion: 6 */
define(['mozart', 'Behavior', 'Builder', 'Body'], function (mozart, behavior, Builder, Body) {
Behavior = behavior.B;

var player = new Behavior(function(bodyPriv, bodyPubl){
	if(!bodyPubl.isAgent()){return;}
	robotSprite = bodyPriv.getSprite("robot");
	gunSprite = bodyPriv.getSprite("gun");
	deadSprite = bodyPriv.getSprite("dead");
	winSprite = bodyPriv.getSprite("win");


	document.getElementById('hud-coins').innerHTML = bodyPriv.properties.coins;
	document.getElementById('hud-battery').innerHTML = Math.max(0,(Math.round(bodyPriv.properties.energy * 10) / 10));
	document.getElementById('hud-health').innerHTML = Math.max(0,(Math.round(bodyPriv.properties.health * 10) / 10));


	if(bodyPriv.properties.health < 1 || bodyPriv.properties.energy < 1){
		robotSprite.hide(); gunSprite.hide();winSprite.hide(); deadSprite.show(); return;}

	if(bodyPriv.properties.win){robotSprite.hide(); gunSprite.hide(); deadSprite.hide();winSprite.show(); return;}

	if(bodyPriv.properties.nextMove){
		var options = bodyPriv.properties.nextMove.split(':');
		var turned = robotSprite.getInfo().fh?-1:1;// false: right, true: left
			if(turned<0){gunSprite.setPos(-5,0);}else{gunSprite.setPos(5,0);}
		if(options[0] == "jump"){
			if(bodyPubl.onGround()){
				amount = Number(options[1]);
				if(Math.abs(amount) > 20){amount = 20 * Math.sign(amount);}
				gunSprite.hide();
				robotSprite.show();
				bodyPriv.k.ax = amount/2;
				bodyPriv.k.ay = -15;
				bodyPriv.properties.energy -= (2 + Math.abs(amount)/20);
			}
		}else if(options[0] == "move"){
			if(bodyPubl.onGround()){
				amount = Number(options[1]);
				if(Math.abs(amount) > 20){amount = 20 * Math.sign(amount);}
				gunSprite.hide();
				robotSprite.show();
				bodyPriv.k.ax = amount*2;
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

	bodyPriv.properties.events = [];
	if(bodyPubl.onGround()){
		bodyPriv.properties.events.push({event: 'ground'});
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
				if(typeof(a) == 'object'){a = JSON.stringify(a);}
				if(typeof(a) == 'function'){a = '[Function]'}
				if(b == null || b == undefined){
					console_output('<b>&larr; ' + a + '</b>');
				}else if(b == ''){
					console_output('&rarr; ' + a);
				}else{
					if(typeof(b) == 'object'){b = JSON.stringify(b);}
					if(typeof(b) == 'function'){b = '[Function]'}
					console_output('&rarr; ' + a + '<br><b>&larr; ' + b + '</b>');
				}
			},
			error: function(a){
				setConsoleError(true);
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

	var requires = `
		var __requires__ = {};
		require = function(a){
			if(a in __requires__){
				return __requires__[a];
			}
			return {};
		};
		var __requirefiles__ = Files.files();
		for(var i = 1; i < __requirefiles__.length; i++){
			var mod = Files.file(i);
			if(mod !== null && typeof(mod) == 'object' && 'text' in mod){
				var __module__ = new Function('var module = {};' + mod.text + '\\nreturn module.exports;');
				__requires__[__requirefiles__[i]] = __module__();
			}
		}
	`;

	if(typeof newcommand !== 'undefined' && newcommand !== ""){
		var commandFn= new Function(logging + hideGlobals +
			"var robot = this; var return_output = " + newcommand +
			"\n\nreturn return_output;");

		var a = bodyPubl.command(commandFn);
		if(keyboardControl){
			newcommand = ""; return;
		}
		if(a.error === null){
			a.output = a.output || '';
			console.log(newcommand, a.output);
		}else{
			console.error(a.error.name + ': ' + a.error.message);
		}
		newcommand = "";
	}

	var g;
	if(typeof newcode !== 'undefined' && newcode){
		g = Function(logging + hideGlobals + requires + Files.file(0).text + scriptTail);
		g().init(bodyPubl);
		bodyPubl.playerCode = g().loop;
		newcode = false;
	}

	if(typeof resetcode !== 'undefined' && resetcode){
		bodyPubl.playerCode = function(){};
		bodyPubl.action = {type: 'wait'};
		resetcode = false;
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
				customPropertiesString += "<tr><td><b>" + prop.key + ": </b></td><td><b>" + JSON.stringify(prop.value) + "</b></td></tr>";
			}
			customFunctionsString = "";
			for(prop of customFunctions){
				if(prop == 'playerCode'){continue;}
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

},
// player collides with something
function(bodyPriv, bodyPubl, collideWith){
		collideExists = false;
		if(!('events' in bodyPriv.properties)){
			bodyPriv.properties.events = [];
		}
		for(var ev in bodyPriv.properties.events){
			if(ev.event == 'collide'){
				collideExists = true;
			}
		}
		if(!collideExists){
			bodyPriv.properties.events.push({event: 'collide', with: collideWith});
		}
		if(collideWith.t == 'spikes')
		{
			if('properties' in collideWith &&
			collideWith.properties !== null &&
			'spikesUp' in collideWith.properties &&
			collideWith.properties.spikesUp){
				bodyPriv.properties.health = 0;
				return false;
			}
			return true;
		}
		else if(collideWith.t == 'portal')
		{
			if('properties' in collideWith &&
				collideWith.properties !== null &&
				'portalDestination' in collideWith.properties &&
				collideWith.properties.portalDestination !== null){
					var a = collideWith.properties.portalDestination;
					var d = collideWith.properties.portalDestination.d;
				bodyPriv.k.x = a.x + (d%2) * (bodyPubl.info().width / 2 + 5) * ((d==3)?(-1):(1));
				bodyPriv.k.y = a.y + ((d+1)%2) * (bodyPubl.info().height / 2 + 5)* ((d === 0)?(-1):(1));
				bodyPriv.k.vx = 0;
				bodyPriv.k.vy = 0;
				return true;
			}
			return false;
		}
		else if(collideWith.t == 'battery')
		{
			if(isNaN(bodyPriv.properties.energy)){
				bodyPriv.properties.energy = 0;
			}
			bodyPriv.properties.energy = 100;
			return true;
		}
		else if(collideWith.t == 'coin')
		{
			if(isNaN(bodyPriv.properties.coins)){
				bodyPriv.properties.coins = 0;
			}
			bodyPriv.properties.coins += 1;
			return true;
		}
		else if(collideWith.t == 'flag')
		{
			if(isNaN(bodyPriv.properties.win)){
				bodyPriv.properties.win = true;
				getFlag();
			}
			return true;
		}
		else if(collideWith.t == 'sparkstrip')
		{
			if(isNaN(bodyPriv.properties.health)){
				bodyPriv.properties.health = 100;
			}
			bodyPriv.properties.health -= 60;
			effects.play("spark",{x: bodyPriv.k.x, y: bodyPriv.k.y});
			return false;
		}
		else if(collideWith.t == 'bullet')
		{
			if(isNaN(bodyPriv.properties.health)){
				bodyPriv.properties.health = 100;
			}
			bodyPriv.properties.health -= 10;
			return false;
		}
		else if(collideWith.t == 'lift')
		{
			bodyPriv.k.y += collideWith.k.vy;
			bodyPriv.k.x += collideWith.k.vx;
			//bodyPriv.k.vx == null;
			return 'skipX';
		}
		else if(collideWith.t == 'enemy')
		{
			if(isNaN(bodyPriv.properties.health)){
				bodyPriv.properties.health = 100;
			}
			if(collideWith.obj.properties.dead === false){
				bodyPriv.properties.health -= 2;
			}
			return false;
		}
		else{
			return false;
		}
});
return player;
});
