define(['mozart'], function (mozart) {

var Effects = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function() {
		__(this).effects = {};
		__(this).mass = undefined;
		__(this).k = {x: 0, y: 0};
	};
	prototype.getK = function(){ return __(this).k; };
	prototype.getType = function(){ return "effects"; };
	prototype.getBox = function(){ return 0; };
	prototype.toBeDestroyed = function(){ return false; };
	prototype.isFixed = function(){ return true; };

	prototype.getMass = function(){ return __(this).mass; };
	prototype.play = function(name,options){
		if(options.x && options.y){
			__(this).effects[name].setPos(options.x, options.y);
		}
		__(this).effects[name].rewind();
		__(this).effects[name].play();
	};
	prototype.render = function(x,y){
		for(var i in __(this).effects){
			__(this).effects[i].redraw(x,y);
		}
	};
	prototype.addEffect = function(name, sprite){
		__(this).effects[name] = sprite;
		__(this).effects[name].setParent(this);
	};
});

return Effects;
});
