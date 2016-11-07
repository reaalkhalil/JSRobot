var mozart = require('mozart');

gravitatingObjects = [];

var Engine = mozart(function(prototype, _, _protected, __, __private) {
	prototype.init = function() {
	__(this).world = [];
	};
	prototype.add = function(sprite){
		__(this).world.push(sprite);
	};
	prototype.step = function(){
		for(var i in __(this).world){
			var obj = __(this).world[i];
			if(!obj.fixed()){
				obj.vy += 2;
				obj.fall();
			}
		}
	};

});
