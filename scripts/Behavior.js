define(["mozart"],function (mozart) {

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

return {B: Behavior, g: gravitate};
});
