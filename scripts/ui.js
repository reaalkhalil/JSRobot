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
var minmaxBtn = document.getElementById("minmax");
var lineheight = document.getElementById("lineheight");

var newcode = false;
var newcommand = "";

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
doCodeLines();
code.onkeyup = function(e) {
	doCodeLines();
};

function openCommandDiv(){
	commandDiv.style.display = "block";
	propertiesDiv.style.display = "none";
	codeDiv.style.display = "none";
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
	commandBtn.className = "";
	propertiesBtn.className = "";
	codeBtn.className = "selected";
	minmaxBtn.innerHTML = "<a>_</a>";
	buttonbar.classList.remove("minimized");
	code.focus();
}
function openPropertiesDiv(){
	propertiesDiv.style.display = "block";
	commandDiv.style.display = "none";
	codeDiv.style.display = "none";
	commandBtn.className = "";
	codeBtn.className = "";
	propertiesBtn.className = "selected";
	minmaxBtn.innerHTML = "<a>_</a>";
	buttonbar.classList.remove("minimized");
}
function minimize(){
	buttonbar.classList.add("minimized");
	codeDiv.style.display = "none";
	propertiesDiv.style.display = "none";
	commandDiv.style.display = "none";
	minmaxBtn.innerHTML = "<a>&#11027;</a>";
}
function maximize(){
	buttonbar.classList.remove("minimized");
	if(commandBtn.className == "selected"){
		openCommandDiv();
	}else if(codeBtn.className == "selected"){
		openCodeDiv();
	}else{
		openPropertiesDiv();
	}
}

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
	if(codeDiv.style.display == "none" && commandDiv.style.display == "none" && propertiesDiv.style.display == "none"){
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
	if(codeDiv.style.display!="none"){
		buttonbar.style.cursor = "ns-resize";
	}
};
onmouseup = function(e){
	dragging = false;
	buttonbar.style.cursor = "default";
};
onmousemove = function(e){
	if(dragging && codeDiv.style.display!="none"){
		var height = Number(code.style.height.replace("px",""));
		var newheight = height + dragy - e.clientY;
		if(newheight < 63){newheight = 63;}
		code.style.height = newheight;
		linenumbers.style.height = newheight - 14;
		dragy = e.clientY;
	}
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
			}else if(commandBtn.classList.contains("selected")){
				openCodeDiv();
			}else if(codeBtn.classList.contains("selected")){
				openPropertiesDiv();
			}
		}else if(e.keyCode == 38) {
			maximize();
		}else if(e.keyCode == 39) {
			if(propertiesBtn.classList.contains("selected")){
				openCodeDiv();
			}else if(commandBtn.classList.contains("selected")){
				openPropertiesDiv();
			}else if(codeBtn.classList.contains("selected")){
				openCommandDiv();
			}
		}else if(e.keyCode == 40) {
			minimize();
		}
	}
};

