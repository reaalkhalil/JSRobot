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
	if(bodyPriv.fixed || bodyPriv.type != "player"){return;}
	if(arrowkeys[0]){ bodyPriv.k.ax += -1; }
	if(arrowkeys[1]){ bodyPriv.k.ay += -2; }
	if(arrowkeys[2]){ bodyPriv.k.ax += 1; }
	if(arrowkeys[3]){ bodyPriv.k.ay += 1; }
});

return {B: Behavior, g: gravitate, k: keyboardcontrol};
});
