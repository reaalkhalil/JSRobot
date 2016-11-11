/*jshint esversion: 6 */

var canvas = document.getElementById("canvasID");
var context = canvas.getContext("2d");
var images = {};

loadImage("robot1");
loadImage("robot2");
loadImage("coin");
loadImage("wall1");
loadImage("wall2");
loadImage("wall3");
loadImage("battery");

function loadImage(name) {
	images[name] = new Image();
	images[name].onload = function() { 
		resourceLoaded();
	};
	images[name].src = "images/" + name + ".png";
}

var totalResources = 6;
var numResourcesLoaded = 0;
var fps = 30;

var robot1 = new RobotOne({x:200,y:300,agent:true, type: "robotc"});
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

var robot2 = new RobotOne({x:500,y:300,agent:true, type: "robot"});
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


coin = new Body({x:100,y:100, type: "coin"}); 
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

wall = new Body({x: 40, y: 500, fixed: true, type: "wall", mass: -1}); 
wall.addSprite(new Sprite({
	'context': context,
	x: 0,
	y: 0,
	width: 50,
	height: 50,
	destwidth: 40,
	destheight: 40,
	image: images.wall1
}));
wall.addSprite(new Sprite({ 'context': context, x: 40, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall2 }));
wall.addSprite(new Sprite({ 'context': context, x: 80, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall3 }));
wall.addSprite(new Sprite({ 'context': context, x: 120, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall1 }));
wall.addSprite(new Sprite({ 'context': context, x: 160, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall2 }));
wall.addSprite(new Sprite({ 'context': context, x: 200, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall3 }));
wall.addSprite(new Sprite({ 'context': context, x: 240, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall1 }));
wall.addSprite(new Sprite({ 'context': context, x: 280, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall2 }));
wall.addSprite(new Sprite({ 'context': context, x: 320, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall3 }));
wall.addSprite(new Sprite({ 'context': context, x: 360, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall1 }));
wall.addSprite(new Sprite({ 'context': context, x: 400, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall2 }));
wall.addSprite(new Sprite({ 'context': context, x: 440, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall3 }));
wall.addSprite(new Sprite({ 'context': context, x: 480, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall1 }));
wall.addSprite(new Sprite({ 'context': context, x: 520, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall2 }));
wall.addSprite(new Sprite({ 'context': context, x: 560, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall3 }));
wall.addSprite(new Sprite({ 'context': context, x: 600, y: 0, width: 50, height: 50, destwidth: 40, destheight: 40, image: images.wall1 }));

wall2 = new Body({x: 400, y: 460, fixed: true, type: "wall", mass: -1}); 
wall2.addSprite(new Sprite({
	'context': context,
	x: 0,
	y: 0,
	width: 50,
	height: 50,
	destwidth: 40,
	destheight: 40,
	image: images.wall1,
	r: -Math.PI/2
}));

engine = new Engine();
engine.add(wall);
engine.add(wall2);
engine.add(robot1);
engine.add(robot2);
engine.add(coin);

function resourceLoaded() {
	numResourcesLoaded += 1;
	if(numResourcesLoaded === totalResources) {
		engine.start();
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
