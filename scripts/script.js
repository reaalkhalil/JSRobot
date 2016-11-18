/*jshint esversion: 6 */

var canvas = document.getElementById("canvasID");
var context = canvas.getContext("2d");
var images = {};

var Game = {};

var importeddata = {
		"elements": {
				"player": {"x": 50, "y": 0},
				"coins": [{x: 300, y: 80}, {x: 400,y: 100}, {x: 450,y: 100}],
				"batteries": [{x: 350, y: 200}, {x: 450, y: 150}],
				"walls": {"origin": [0,0],
						"data":["                    ",
								"                    ",
								"                    ",
								"                    ",
								"                    ",
								"                    ",
								"                    ",
								"                    ",
								"           #        ",
								"----------- --------"
						]
				}
		}

};

loadImage("robot2");
loadImage("bullet");
loadImage("coinpop");
loadImage("batterypop");
loadImage("bulletpop");

function loadImage(name) {
	images[name] = new Image();
	images[name].onload = function() { 
		resourceLoaded();
	};
	images[name].src = "images/" + name + ".png";
}

var totalResources = 17;
var numResourcesLoaded = 0;
var fps = 30;

var robot2 = new RobotOne({x:400,y:300,agent:false, type: "robot", properties: {energy: 100, coins: 0, health: 100}});
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

//STILL MAKES WALLS ONE PIECE
//robot1.setOpponent(robot2);
//robot2.setOpponent(robot1);

engine = new Engine();
//engine.add(wall);
//engine.add(wall2);
//engine.add(robot1);
engine.add(robot2);


effects.addEffect("bulletpop",new Sprite({
	'context': context,
	name: "bulletpop",
	x: 0,
	y: 0,
	width: 36,
	height: 9,
	destwidth: 20,
	destheight: 20,
	image: images.bulletpop,
	numberOfFrames: 4,
	visible: false,
	ticksPerFrame: 1
}));

effects.addEffect("coinpop",new Sprite({
	'context': context,
	name: "coinpop",
	x: 0,
	y: 0,
	width: 36,
	height: 14,
	destwidth: 18,
	destheight: 28,
	image: images.coinpop,
	numberOfFrames: 4,
	visible: false,
	ticksPerFrame: 2
}));

effects.addEffect("batterypop",new Sprite({
	'context': context,
	name: "batterypop",
	x: 0,
	y: 0,
	width: 36,
	height: 14,
	destwidth: 18,
	destheight: 28,
	image: images.batterypop,
	numberOfFrames: 4,
	visible: false,
	ticksPerFrame: 2
}));


engine.add(effects);

function resourceLoaded() {
	numResourcesLoaded += 1;
	if(numResourcesLoaded === totalResources) {
		//engine.start();
	}
}


/*
 function loadJSON(path, callback) {

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 loadJSON("data/level.js", function(response) {
  // Parse JSON string into object
    var actual_JSON = JSON.parse(response);
 });

*/
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

