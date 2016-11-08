/*jshint esversion: 6 */

var canvas = document.getElementById("canvasID");
var context = canvas.getContext("2d");
var images = {};
var elements = [];

loadImage("robot1");
loadImage("robot2");
loadImage("coin");

function loadImage(name) {
	images[name] = new Image();
	images[name].onload = function() { 
		resourceLoaded();
	};
	images[name].src = "images/" + name + ".png";
}

var totalResources = 3;
var numResourcesLoaded = 0;
var fps = 30;

var robot1 = new RobotOne({x:200,y:300});
robot1.addSprite(new Sprite({
	'context': context,
	x: 0,
	y: 0,
	width: 79,
	height: 108,
	destwidth: 30,
	destheight: 41,
	image: images.robot1
}));

var robot2 = new RobotOne({x:500,y:300});
robot2.addSprite(new Sprite({
	'context': context,
	x: 0,
	y: 0,
	width: 79,
	height: 108,
	destwidth: 30,
	destheight: 41,
	image: images.robot2
}));

robot1.setOpponent(robot2);
robot2.setOpponent(robot1);


coin = new Body({x:100,y:100}); 
coin.addSprite(new Sprite({
	'context': context,
	x: 0,
	y: 0,
	width: 120,
	height: 20,
	destwidth: 20,
	destheight: 20,
	image: images.coin,
	numberOfFrames: 6,
	loop: true,
	ticksPerFrame: 4
}));

engine = new Engine();
engine.add(robot1);
engine.add(robot2);
engine.add(coin);

function resourceLoaded() {
	numResourcesLoaded += 1;
	if(numResourcesLoaded === totalResources) {
		engine.start();
	}
}

function redrawall(){
	robot1.step();
	robot2.step();
	engine.step();

	canvas.width = canvas.width; // clears the canvas
	context.mozImageSmoothingEnabled = false;
	context.webkitImageSmoothingEnabled = false;
	context.msImageSmoothingEnabled = false;
	context.imageSmoothingEnabled = false;
	for(var i in elements){
		elements[i].redraw();
	}
}








/*
 * EXTENDING... (MIXINS)
var circleFns = {
  area: function() {
    return Math.PI * this.radius * this.radius;
  },
  grow: function() {
    this.radius++;
  },
  shrink: function() {
    this.radius--;
  }
};  


function extend(destination, source) {
  for (var k in source) {
    if (source.hasOwnProperty(k)) {
      destination[k] = source[k];
    }
  }
  return destination; 
}

var RoundButton = function(radius, label) {
  this.radius = radius;
  this.label = label;
};
 
extend(RoundButton.prototype, circleFns);
*/
