
var canvas = document.getElementById("canvasID");
mousePosCanvas = {x: 0, y: 0};
mousePosGame = {x: 0, y: 0};
function getMousePos(canvas, evt) {
   var rect = canvas.getBoundingClientRect();
   return {
      x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

canvas.addEventListener('mousemove', function(evt) {
      mousePosCanvas = getMousePos(canvas, evt);
   }, false);

var codearea = document.getElementById("codearea");
var context = canvas.getContext("2d");
var fps = 30;
var Game = {};

requirejs.config({
    baseUrl: 'scripts',
});

function startLevel(level, language){
  requirejs(['mozart',
  	   	'../data/levels',
  	   	'../data/instructions',
  	   	'Behavior',
  	   	'Builder',
  	   	'Engine',
  	   	'Body',
  	   	'Robot',
  	   	'Sprite',
  	   	'Effects',
  	   	'Player',
  	   	'Collision'],
  function   (mozart, levelData, instructionData, Behavior, builder, Engine, Body, robot, Sprite, Effects, Player, Collision) {

  	//Player = Player;
  	//Robot = robot.Robot;
  	//RobotOne = robot.RobotOne;
   currentLevel = levels[level - 1];
  	collide = Collision; // use as a static method
  	effects = new Effects();
  	engine = new Engine();
  	//engine.add(effects);
  });
}
