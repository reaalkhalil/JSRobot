var menu = document.getElementById("menu");
var play = document.getElementById("play");
var speechbubble = document.getElementById("speechbubble");

var prevlevelButton = document.getElementById("prevlevel");
var levelButton = document.getElementById("level");
var startButton = document.getElementById("start");

var level = 1;

lines = ['Beep boop!',
			'01101000 01101001',
			'Have a spare charger?',
			'DESTROY. DESTROY.',
			'Resistance is futile.',
			'Sleep is for humans..',
			'We\'re stealing your jobs LOL'];

var saveCode = function(level, code)
{
	if(!localStorage)
	{
		return false;
	}
	localStorage['js_robot_level_' + level] = code;
};

var getCode = function(level)
{
	var code = localStorage['js_robot_level_' + level];
	return code?code:'';
};

speechbubble.innerHTML = lines[Math.floor(Math.random() * (lines.length))];

var maxLevels = 1;
var levels;
requirejs.config({
    baseUrl: 'scripts',
});

requirejs(['mozart', '../data/levels'],
  function (mozart, levelData) {
		levels = (new levelData()).levels;
    maxLevels = levels.length;

	menu.style.display = "block";

	if(location.hash.length > 0){
		if(!isNaN(location.hash.slice(7,8))){
			level = Number(location.hash.slice(7,8));
			if(level <= maxLevels){
				code = getCode(level);
				startGame(level, code);
				menu.style.display = "none";
			}
		}
	}
});

prevlevelButton.onclick = function(){
	level = Math.max(1, level - 1);
	levelButton.innerHTML = "Level " + level;
};

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

levelButton.onclick = function(){
	level = Math.min(maxLevels, level + 1);
	levelButton.innerHTML = "Level " + level;
};

function startGame(level, code){
	menu.style.display = "none";
	play.style.display = "inherit";
	openInstructionsDiv();
	startLevel(level);
	instructionsDiv.innerHTML = levels[level-1].instructions;
  if(code !== undefined && code !== ''){
    editor.setValue(code);
    openCodeDiv();
  }
}

startButton.onclick = function(){
	startGame(level, '');
	location.hash = "level=" + level;
};






var backtomenu = document.getElementById("backtomenu");
var nextlevel = document.getElementById("nextlevel");
var restartlevel = document.getElementById("restartlevel");
var submit = document.getElementById("submitCode");
var code = document.getElementById("code");
var codeDiv = document.getElementById("codeDiv");
var command = document.getElementById("command");
var commandDiv = document.getElementById("commandDiv");
var buttonbar = document.getElementById("buttonbar");
var commandBtn = document.getElementById("commandBtn");
var codeBtn = document.getElementById("codeBtn");
var propertiesBtn = document.getElementById("propertiesBtn");
var propertiesDiv = document.getElementById("propertiesDiv");
var instructionsBtn = document.getElementById("instructionsBtn");
var instructionsDiv = document.getElementById("instructionsDiv");
var minmaxBtn = document.getElementById("minmax");
var lineheight = document.getElementById("lineheight");
var codearea = document.getElementById("codearea");
var topBarpracticeMode = document.getElementById("topbar-practicemode");
var pauseButton = document.getElementById("topbar-pausebutton");
var repeatLevel = document.getElementById("repeatlevel");
var toggleKeyboardControlButton = document.getElementById("topbar-arrowkeys");


var newcode = false;
var resetcode = false;
var practiceMode = false;
var codeRunning = false;
var newcommand = "";
var keyboardControl = false;

backtomenu.onclick = function(){
	location.hash = "";
	location.reload();
};

function getFlag(){
	if(practiceMode){
		repeatLevel.style.display = "block";
	}else{
		nextlevel.style.display = "block";
	}
}

nextlevel.onclick = function(){
	level = Math.min(maxLevels, level + 1);
	location.hash = "level=" + level;
	location.reload();
};

restartlevel.onclick = function(){
	location.hash = "level=" + level;
	saveCode(level, editor.getValue());
	location.reload();
};

repeatLevel.onclick = restartlevel.onclick;

pauseScript = function(){
	if(codeRunning){
		practiceMode = true;
		codeRunning = false;
		topBarpracticeMode.style.display="inline-block";
		resetScript();
	}
}

pauseButton.onclick = function(){
		pauseScript();
};

setKeyboardControl = function(a){
	keyboardControl = a;
	if(keyboardControl){
		practiceMode = true;
		topBarpracticeMode.style.display="inline-block";
		toggleKeyboardControlButton.classList.add('on')
	}else{
		toggleKeyboardControlButton.classList.remove('on')
	}
}

toggleKeyboardControlButton.onclick = function(){
	if(codeRunning){
		console.error("Error: Pause the running script to control the robot with your keyboard.")
		return;
	}
	setKeyboardControl(!keyboardControl);
}

function applyScript(){
	setKeyboardControl(false);
	saveCode(level, editor.getValue());
	newcode = true;
	codeRunning = true;
	document.getElementById('submitCode').classList.add('running');
}

function resetScript(){
	codeRunning = false;
	resetcode = true;
	document.getElementById('submitCode').classList.remove('running');
}

submit.onclick = function(){
	saveCode(level, editor.getValue());
	applyScript();
};

var commandLog = [];
var commandIndex = 0;

function executeCommand(commandText){
		newcommand = commandText;
		commandLog.push(commandText);
		commandIndex = 0;
		command.classList.add('execute');
		setTimeout(function(){command.classList.remove('execute');}, 80);
}

command.onkeydown = function(e) {
  if(e.keyCode === 13) {

		if(codeRunning){
			console.error("Error: Pause the running script to run commands.")
			return;
		}
		executeCommand(command.value);
		practiceMode = true;
		topBarpracticeMode.style.display="inline-block";

		e.preventDefault();
	}else if(e.keyCode === 38 && commandLog.length -1 > commandIndex) {
		commandIndex++;
		command.value = commandLog[commandLog.length - 1 - commandIndex];
		e.preventDefault();
	}else if(e.keyCode === 40 && commandIndex > 0) {
		commandIndex--;
		command.value = commandLog[commandLog.length - 1 - commandIndex];
		e.preventDefault();
	}
};
code.onkeydown = function(e) {
    if(e.keyCode === 9) {
        var start = this.selectionStart;
        var end = this.selectionEnd;
		var value = this.value;
        this.value = (value.substring(0, start) + "\t" + value.substring(end));
        this.selectionStart = this.selectionEnd = start + 1;
        e.preventDefault();
    }
};
function openInstructionsDiv(){
	propertiesDiv.style.display = "none";
	commandDiv.style.display = "none";
	codeDiv.style.display = "none";
	instructionsDiv.style.display = "block";
	instructionsBtn.className = "selected";
	commandBtn.className = "";
	codeBtn.className = "";
	propertiesBtn.className = "";
	minmaxBtn.innerHTML = "<a>_</a>";
	buttonbar.classList.remove("minimized");
}

function openCommandDiv(){
	commandDiv.style.display = "block";
	propertiesDiv.style.display = "none";
	codeDiv.style.display = "none";
	instructionsDiv.style.display = "none";
	instructionsBtn.className = "";
	codeBtn.className = "";
	propertiesBtn.className = "";
	commandBtn.className = "selected";
	minmaxBtn.innerHTML = "<a>_</a>";
	buttonbar.classList.remove("minimized");
	command.focus();
}
function openCodeDiv(){
	codeDiv.style.display = "block";
	propertiesDiv.style.display = "none";
	commandDiv.style.display = "none";
	instructionsDiv.style.display = "none";
	instructionsBtn.className = "";
	commandBtn.className = "";
	propertiesBtn.className = "";
	codeBtn.className = "selected";
	minmaxBtn.innerHTML = "<a>_</a>";
	buttonbar.classList.remove("minimized");
}
function openPropertiesDiv(){
	propertiesDiv.style.display = "block";
	commandDiv.style.display = "none";
	codeDiv.style.display = "none";
	instructionsDiv.style.display = "none";
	instructionsBtn.className = "";
	commandBtn.className = "";
	codeBtn.className = "";
	propertiesBtn.className = "selected";
	minmaxBtn.innerHTML = "<a>_</a>";
	buttonbar.classList.remove("minimized");
}
var oldCodeareaHeight = 0;
function minimize(){
	buttonbar.classList.add("minimized");
	codeDiv.style.display = "none";
	propertiesDiv.style.display = "none";
	instructionsDiv.style.display = "none";
	commandDiv.style.display = "none";
	minmaxBtn.innerHTML = "<a>&#11027;</a>";
  oldCodeareaHeight = codearea.style.height;
  codearea.style.height = 35;
}
function maximize(){
   codearea.style.height = oldCodeareaHeight;
	buttonbar.classList.remove("minimized");
	if(commandBtn.className == "selected"){
		openCommandDiv();
	}else if(codeBtn.className == "selected"){
		openCodeDiv();
	}else if(instructionsBtn.className == "selected"){
		openInstructionsDiv();
	}else{
		openPropertiesDiv();
	}
}

instructionsBtn.onclick = function(){
	openInstructionsDiv();
	if(codearea.style.height == '35px'){
		maximize();
	}
};
propertiesBtn.onclick = function(){
	openPropertiesDiv();
	if(codearea.style.height == '35px'){
		maximize();
	}
};
commandBtn.onclick = function(){
	openCommandDiv();
	if(codearea.style.height == '35px'){
		maximize();
	}
};
codeBtn.onclick = function(){
	openCodeDiv();
	if(codearea.style.height == '35px'){
		maximize();
	}
};
minmaxBtn.onclick = function(){
	if(codeDiv.style.display == "none" &&
			commandDiv.style.display == "none" &&
			propertiesDiv.style.display == "none" &&
			instructionsDiv.style.display == "none")
	{
		maximize();
	}else{
		minimize();
	}
};

var dragy = 0;
var dragging = false;
buttonbar.onmousedown = function(e){
  if(codearea.style.height != '35px'){
  	dragy = e.clientY;
  	dragging = true;
  }
};

onmouseup = function(e){
	dragging = false;
	buttonbar.style.cursor = "default";
};

onmousemove = function(e){
	if(dragging){
		buttonbar.style.cursor = "ns-resize";
		var height = Number(codearea.style.height.replace("px",""));
		var newheight = height + dragy - e.clientY;
		if(newheight < 104){newheight = 104;}
		codearea.style.height = newheight;
		dragy = e.clientY;
  }
};


onkeydown = function(e) {
    if(e.metaKey || e.ctrlKey) {
    	if(e.keyCode == 13) {
				if(!codeRunning){
					applyScript();
				}else{
					pauseScript();
				}
				return false;
		}else if(e.keyCode == 49) {
			openInstructionsDiv();
      return false;
		}else if(e.keyCode == 50) {
			openCodeDiv();
      return false;
		}else if(e.keyCode == 51) {
			openCommandDiv();
      return false;
		}else if(e.keyCode == 52) {
			openPropertiesDiv();
      return false;
		}
	}
};

topBarpracticeMode.style.display = 'none';





/////////////// keyboard control

command.onfocus = function(){
	setKeyboardControl(false);
}

document.onkeydown = function myFunction() {
	if(keyboardControl){
		key = event.keyCode || event.which;
		executeCommand("robot.setAction({keyCode: " + key + "});")
	}
};
