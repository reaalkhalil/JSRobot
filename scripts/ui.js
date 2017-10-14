var menu = document.getElementById("menu");
var play = document.getElementById("play");
var speechbubble = document.getElementById("speechbubble");

var prevlevelButton = document.getElementById("prevlevel");
var levelButton = document.getElementById("level");
var startButton = document.getElementById("start");

var level = 1;

lines = ['Beep boop!', '01101000 01101001', 'Have a spare charger?', 'DESTROY. DESTROY.', 'Resistance is futile.', 'Sleep is for humans..', 'We\'re stealing your jobs LOOL']
speechbubble.innerHTML = lines[Math.floor(Math.random() * (lines.length))];

var maxLevels = 1;
var levels;
requirejs.config({
    baseUrl: 'scripts',
});
requirejs(['mozart', '../data/levels'],
  function (mozart, levelData) {
		levels = (new levelData()).levels
    maxLevels = levels.length;

	var gameStarted = false;
	if(location.hash.length > 0){
		if(!isNaN(location.hash.slice(1))){
			level = Number(location.hash.slice(1));
			if(level <= maxLevels){
				startGame(level);
				gameStarted = true;
			}
		}
	}
	if(!gameStarted){
		menu.style.display = "block";
	}
});

prevlevelButton.onclick = function(){
	level = Math.max(1, level - 1);
	levelButton.innerHTML = "Level " + level;
};

levelButton.onclick = function(){
	level = Math.min(maxLevels, level + 1);
	levelButton.innerHTML = "Level " + level;
};

function startGame(level){
	menu.style.display = "none";
	play.style.display = "inherit";
	doCodeLines();
	openInstructionsDiv();
	startLevel(level)
	instructionsDiv.innerHTML = levels[level-1].instructions;
}
startButton.onclick = function(){
	startGame(level)
	location.hash = level;
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
var linenumbers = document.getElementById("linenumbers");
var codearea = document.getElementById("codearea");

var newcode = false;
var newcommand = "";

backtomenu.onclick = function(){
	location.hash = "";
	location.reload();
}

nextlevel.onclick = function(){
	level = Math.min(maxLevels, level + 1);
	location.hash = level;
	location.reload();
}

restartlevel.onclick = function(){
	location.reload();
}

function applyScript(){
	code.classList.add('execute');
	setTimeout(function(){code.classList.remove('execute');}, 80);
	newcode = true;
}

submit.onclick = function(){
	applyScript();
};

var commandLog = [];
var commandIndex = 0;

command.onkeydown = function(e) {
    if(e.keyCode === 13) {
		newcommand = command.value;
		commandLog.push(command.value);
		commandIndex = 0;
		command.classList.add('execute');
		setTimeout(function(){command.classList.remove('execute');}, 80);
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
function doCodeLines(){
	var linenumberstext = "";
	var lines = code.value.split('\n');
		//tabs to 4 spaces;
	var count = (code.value.match(/\n/g) || []).length;
	if(count>=99){
		code.style.paddingLeft = "32px";
	}else{
		code.style.paddingLeft = "25px";
	}
	for(var i = 1; i <= 1+count; i++){
		breaks = Math.ceil((lines[i-1].length*6.622533333)/(code.clientWidth- 39));
		if(lines[i-1].length === 0){breaks = 1;}
		linenumberstext = linenumberstext + i;
		for(var j = 1; j <= breaks; j++){
			linenumberstext = linenumberstext + "<br>";
		}
	}
	linenumbers.innerHTML = linenumberstext + "<br>";
}
code.onkeyup = function(e) {
	doCodeLines();
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
	doCodeLines();
	code.focus();
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
};
propertiesBtn.onclick = function(){
	openPropertiesDiv();
};
commandBtn.onclick = function(){
	openCommandDiv();
};
codeBtn.onclick = function(){
	openCodeDiv();
};
minmaxBtn.onclick = function(){
	if(codeDiv.style.display == "none" && commandDiv.style.display == "none" && propertiesDiv.style.display == "none" && instructionsDiv.style.display == "none"){
		maximize();
	}else{
		minimize();
	}
};

var dragy = 0;
var dragging = false;
buttonbar.onmousedown = function(e){
	dragy = e.clientY;
	dragging = true;
	buttonbar.style.cursor = "ns-resize";
};
onmouseup = function(e){
	dragging = false;
	buttonbar.style.cursor = "default";
};
onmousemove = function(e){
	if(dragging){
		var height = Number(codearea.style.height.replace("px",""));
  }
	var newheight = height + dragy - e.clientY;
	if(newheight < 63){newheight = 63;}
  codearea.style.height = newheight;
	dragy = e.clientY;
};


linenumbers.style.height = Number(code.style.height.replace("px","")) - 14;

code.onscroll = function(){
	linenumbers.scrollTop=code.scrollTop;
};


onkeydown = function(e) {
    if(e.metaKey || e.ctrlKey) {
    	if(e.keyCode == 13) {
			applyScript();
		}else if(e.keyCode == 37) {
			if(propertiesBtn.classList.contains("selected")){
				openCommandDiv();
			}else if(instructionsBtn.classList.contains("selected")){
				openPropertiesDiv();
			}else if(commandBtn.classList.contains("selected")){
				openCodeDiv();
			}else if(codeBtn.classList.contains("selected")){
				openInstructionsDiv();
			}
      return false;
		}else if(e.keyCode == 38) {
			maximize();
      return false;
		}else if(e.keyCode == 39) {
			if(propertiesBtn.classList.contains("selected")){
				openInstructionsDiv();
			}else if(instructionsBtn.classList.contains("selected")){
				openCodeDiv();
			}else if(commandBtn.classList.contains("selected")){
				openPropertiesDiv();
			}else if(codeBtn.classList.contains("selected")){
				openCommandDiv();
			}
      return false;
		}else if(e.keyCode == 40) {
			minimize();
      return false;
		}
	}
};

