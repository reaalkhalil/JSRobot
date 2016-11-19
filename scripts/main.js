
var canvas = document.getElementById("canvasID");
var context = canvas.getContext("2d");
var fps = 30;
var Game = {};

requirejs.config({
    baseUrl: 'scripts',
});

requirejs(['mozart',
	   	'../data/level',
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
	collide = Collision; // use as a static method
	effects = new Effects();
	engine = new Engine();
	//engine.add(effects);

});
