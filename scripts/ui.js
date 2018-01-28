var menu = document.getElementById("menu");
var play = document.getElementById("play");
var speechbubble = document.getElementById("speechbubble");

var prevlevelButton = document.getElementById("prevlevel");
var levelButton = document.getElementById("level");
var startButton = document.getElementById("start");

var level = 1;
var language = 'en';

lines = ['Beep boop!',
			'01101000 01101001',
			'Have a spare charger?',
			'DESTROY. DESTROY.',
			'Resistance is futile.',
			'Sleep is for humans..',
			'We\'re stealing your jobs LOL'];

speechbubble.innerHTML = lines[Math.floor(Math.random() * (lines.length))];

var maxLevels = 1;
var levels;
var allInstructions;

requirejs.config({
    baseUrl: 'scripts',
});

function parseURL(locationHash){
	var loc = locationHash + '';
	var level = null;
	var language = null;

	if(location.hash.length > 0){
		var indexLevel = location.hash.indexOf('level=');
		var indexLang = location.hash.indexOf('language=');

		if(indexLevel != -1){
			var levelString = loc.slice(indexLevel + 6);
			var indexAmp = levelString.indexOf('&');
			if(indexAmp != -1){
				levelString = levelString.slice(0, indexAmp);
				loc = loc.slice(indexLevel + indexAmp + 7);
			}
			if(!isNaN(levelString)){
				level = Number(levelString);
			}
		}

		if(indexLang != -1){
			loc = loc.slice(9);
			language = loc;
		}
	}

	return {level: level, language: language};
}

requirejs(['mozart', '../data/levels', '../data/instructions'],
  function (mozart, levelData, instructionData) {
		levels = (new levelData()).levels;
		allInstructions = new instructionData();

		maxLevels = levels.length;
		menu.style.display = "block";

		if(location.hash.length > 0){
			if(!isNaN(location.hash.slice(7,8))){
				var parse = parseURL(location.hash);
				level = parse.level;
				language = parse.language || 'en';

				if (!(language in allInstructions)) {
					language = 'en';
				}

				if(level <= maxLevels){
					Files.setLevel(level);

				var startingCode = 'function init(robot) {\n' + 
										 '\t// your code goes here\n}\n\n' + 
										 'function loop(robot) {\n' + 
										 '\t// your code goes here\n}\n';


				var content = Files.file(0);
				if (content !== null			     &&
					 typeof(content) == 'object' &&
					 'text' in content			  &&
					 content.text !== ''){
					var savedDoc = CodeMirror.Doc(content.text, 'javascript');
					editor.swapDoc(savedDoc);
					if('history' in content){
						editor.setHistory(content.history);
					}
				}else{
					var newDoc = CodeMirror.Doc(startingCode, 'javascript');
					editor.swapDoc(newDoc);
				}

				startGame(level, language);
				if(content !== null){
					openCodeDiv();
				}
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

function showLevelSolution(){
	document.getElementById('solution').classList.add('shown');
	document.getElementById('showSolution').classList.add('disabled');
}

function startGame(level, language){
	menu.style.display = "none";
	play.style.display = "inherit";
	openInstructionsDiv();
	startLevel(level, language);
	var instructions = allInstructions[language];
	Files.setLevel(level);
	filesPopulate();
	instructionsDiv.innerHTML = instructions[level-1];

	var codeBoxes = instructionsDiv.getElementsByClassName('code');
	for (var i = 0; i < codeBoxes.length; i++) {
		var code = codeBoxes[i].textContent;
		codeBoxes[i].innerHTML = '';
		var myCodeMirror = CodeMirror(codeBoxes[i], {
        value: code,
        mode: 'javascript',
		  lineNumbers: true,
		  indentUnit: 4,
		  indentWithTabs: true,
		  showCursorWhenSelecting: false,
		  lineWrapping: true,
        readOnly: true
		});
		myCodeMirror.setOption("theme", "dracula");
		codeBoxes[i].classList.add('read-only-code');
	}

	var showSolutionBtn = document.getElementById('showSolution');
	if (showSolutionBtn) {
		showSolutionBtn.onclick = showLevelSolution;
	}

	resetCode();
	editor.on('focus', function(){ setKeyboardControl(false); });
	editor.on('blur', function(){ filesSave(); });
}

startButton.onclick = function(){
	startGame(level, language);
	location.hash = "level=" + level + "&language=" + language;
};






var backtomenu = document.getElementById("backtomenu");
var nextlevel = document.getElementById("nextlevel");
var skiplevel = document.getElementById("skiplevel");
var restartlevel = document.getElementById("restartlevel");
var runCodeBtn = document.getElementById("submitCode");
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
		skiplevel.style.display = "block";
	}else{
		nextlevel.style.display = "block";
	}
}

nextlevel.onclick = function(){
	level = Math.min(maxLevels, level + 1);
	location.hash = "level=" + level + "&language=" + language;
	if (language !== null) { 
		location.hash += "&language=" + language;
	}
	location.reload();
};

skiplevel.onclick = nextlevel.onclick;

restartlevel.onclick = function(){
	location.hash = "level=" + level + "&language=" + language;
	location.reload();
};

repeatLevel.onclick = restartlevel.onclick;

pauseScript = function(){
	if(codeRunning){
		practiceMode = true;
		codeRunning = false;
		topBarpracticeMode.style.display="inline-block";
		resetCode();
	}
};

pauseButton.onclick = function(){
		pauseScript();
};

setKeyboardControl = function(a){
	keyboardControl = a;
	if(keyboardControl){
		practiceMode = true;
		topBarpracticeMode.style.display="inline-block";
		toggleKeyboardControlButton.classList.add('on');
	}else{
		toggleKeyboardControlButton.classList.remove('on');
	}
};

toggleKeyboardControlButton.onclick = function(){
	if(codeRunning){
		console.error("Error: Pause the running script to control the robot with your keyboard.");
		return;
	}
	setKeyboardControl(!keyboardControl);
};

function runCode(){
	setKeyboardControl(false);
	newcode = true;
	codeRunning = true;
	runCodeBtn.classList.add('running');
}

function resetCode(){
	codeRunning = false;
	resetcode = true;
	runCodeBtn.classList.remove('running');
}

runCodeBtn.onclick = function(){
	if(codeRunning){
		return;
	}
	runCode();
};

var commandLog = [];
var commandIndex = 0;

function executeCommand(commandText){
		newcommand = commandText;
		commandLog.push(commandText);
		commandIndex = -1;
		command.classList.add('execute');
		setTimeout(function(){command.classList.remove('execute');}, 80);
}

command.onkeydown = function(e) {
  if(e.keyCode === 13) {

		if(codeRunning){
			console.error("Error: Executing commands while a script is running pauses the script.");
			return;
		}
		executeCommand(command.value);
		command.value = '';
		practiceMode = true;
		topBarpracticeMode.style.display="inline-block";

		e.preventDefault();
	}else if(e.keyCode === 38 && commandLog.length -1 > commandIndex) {
		commandIndex++;
		command.value = commandLog[commandLog.length - 1 - commandIndex];
		if(command.value === undefined){command.value = '';}
		e.preventDefault();
	}else if(e.keyCode === 40 && commandIndex > -1) {
		commandIndex--;
		if(commandIndex === -1){command.value = ''; e.preventDefault(); return;}
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
	if(!keyboardControl){
		command.focus();
	}
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
	editor.focus();
	editor.setCursor(editor.lineCount(), 0);
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
		codearea.style.height = Math.min(newheight, window.innerHeight || Infinity);
		dragy = e.clientY;
  }
};


onkeydown = function(e) {
    if(e.metaKey || e.ctrlKey) {
    	if(e.keyCode == 13) {
				if(!codeRunning){
					runCode();
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
		}else if(e.keyCode == 53) {
			openInstructionsDiv();
			setKeyboardControl(true);
			return false;
		}
	}
};

topBarpracticeMode.style.display = 'none';


function setConsoleError(a){
	pauseScript();
	if(a && commandDiv.style.display == "none"){
		commandBtn.classList.add('error');
	}else{
		commandBtn.classList.remove('error');
	}
}



/////////////// keyboard control

command.onfocus = function(){
	setKeyboardControl(false);
};

document.onkeydown = function myFunction() {
	if(keyboardControl){
		key = event.keyCode || event.which;
		executeCommand("robot.setAction({keyCode: " + key + "});");
	}
};



////////////// files sidebar


var filesWindow = document.getElementById("files");
var filesCloseBtn = document.getElementById("files-close");
var filesNewBtn = document.getElementById("files-new");
var filesDeleteBtn = document.getElementById("files-delete");
var filesList = document.getElementById("files-list");

var selectedFile = 0;

filesCloseBtn.onclick = function(){
	if(this.classList.contains('closed')){
		filesWindow.classList.remove('closed');
		this.classList.remove('closed');
	}else{
		filesWindow.classList.add('closed');
		this.classList.add('closed');
	}
};

filesPopulate = function(){
	files = Files.files();
	filesList.innerHTML = '';
	for(var i in files){
		var changeEvent = (i>0) ?
			('onchange="filesNameChange(' + i + ')" onkeydown="filesNameKeyDown(' + i + ')"') :
			'disabled="true"';
		var selected = (i==selectedFile) ? 'class="selected"' : '';
		filesList.innerHTML += ('<li><a id="file-' + i + '" onclick="filesClick(' +
			i + ')" ' + selected + '><input value="' + files[i] +
		'" spellcheck="false" autocomplete="false" ' + changeEvent + '></a></li>');
	}
};

filesSave = function(){
	Files.save(selectedFile,
			{text: editor.getValue(), history: editor.getHistory()});
};

filesClick = function(n){
	if(selectedFile == n){return;}
	//if(selectedFile === 0 || selectedFile && selectedFile < Files.files().length){
		//Files.save(selectedFile,
			//{text: editor.getValue(), history: editor.getHistory()});
	//}
	while(selectedFile >= Files.files().length){
		selectedFile--;
	}

	var content = Files.file(n);
	var doc = editor.getDoc();
	if(content === null){
		var newDoc = CodeMirror.Doc('// New File', 'javascript');
		editor.swapDoc(newDoc);
	}else if(typeof(content) == 'object' && 'text' in content){
		var savedDoc = CodeMirror.Doc(content.text, 'javascript');
		editor.swapDoc(savedDoc);
		if('history' in content){
			editor.setHistory(content.history);
		}
	}else{
		filesPopulate();
		return;
	}
	selectedFile = n;
	filesPopulate();
};

filesDeleteBtn.onclick = function(){
	if(selectedFile === 0){ return; }
	Files.erase(selectedFile);
	var newSelection = selectedFile - 1;
	selectedFile = null;
	filesPopulate();
	filesClick(newSelection);
};

filesNewBtn.onclick = function(){
	var number = 1;
	var newFileName = 'new-file';
	while(!Files.add(newFileName)){
		newFileName = 'new-file-' + (number++);
	}
	selectedFile = null;
	filesPopulate();
	filesClick(Files.find(newFileName));
	var textInput = document.getElementById('file-' + selectedFile)
						 .getElementsByTagName('input')[0];
	textInput.select();
};

filesNameKeyDown = function(n){
	if(event.keyCode == 13){
		var textInput = document.getElementById('file-' + n)
							 .getElementsByTagName('input')[0];
		textInput.blur();
	}
};

filesNameChange = function(n){
	var textInput = document.getElementById('file-' + n)
						 .getElementsByTagName('input')[0];
	newName = textInput.value;
	Files.rename(n, newName);
	selectedFile = null;
	filesPopulate();
	filesClick(Files.find(newName));
};

