
var canvas = document.getElementById("canvasID");
var codearea = document.getElementById("codearea");
var context = canvas.getContext("2d");
var fps = 30;
var Game = {};

requirejs.config({
    baseUrl: 'scripts',
});

function startLevel(level){
  requirejs(['mozart',
  	   	'../data/levels',
  	   	'Behavior',
  	   	'Collision',
  	   	'Builder',
  	   	'Engine',
  	   	'Body',
  	   	'Robot',
  	   	'Sprite',
  	   	'Effects',
  	   	'Agent'],
  function   (mozart, levelData, Behavior, Collision, builder, Engine, Body, robot, Sprite, Effects, Agent) {

  	//agent = Agent;
  	//Robot = robot.Robot;
  	//RobotOne = robot.RobotOne;
    levels = (new levelData()).levels;
    currentLevel = levels[level - 1];
  	collide = Collision; // use as a static method
  	effects = new Effects();
  	engine = new Engine();
  	//engine.add(effects);

  });
}
