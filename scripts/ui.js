var submit = document.getElementById("submitCode");
var code = document.getElementById("code");
var codeDiv = document.getElementById("codeDiv");
var command = document.getElementById("command");
var commandDiv = document.getElementById("commandDiv");
var buttonbar = document.getElementById("buttonbar");
var commandBtn = document.getElementById("commandBtn");
var codeBtn = document.getElementById("codeBtn");
var minmaxBtn = document.getElementById("minmax");
var lineheight = document.getElementById("lineheight");

function applyScript(){
	codeString = code.value+"\nloop(this);";
	robot1.step = new Function(codeString);
}
submit.onclick = function(){
	applyScript();
};

command.onkeydown = function(e) {
    if(e.keyCode === 13) {
		robot1.command(command.value);
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
code.onkeyup = function(e) {
	var linenumberstext = "";
	var lines = code.value.split('\n');
	var count = (code.value.match(/\n/g) || []).length;
	for(var i = 1; i <= 1+count; i++){
		breaks = Math.ceil((lines[i-1].length*6.61538)/(code.clientWidth- 36.28));
		if(lines[i-1].length === 0){breaks = 1;}
		linenumberstext = linenumberstext + i;
		for(var j = 1; j <= breaks; j++){
			linenumberstext = linenumberstext + "<br>";
		}
	}
	linenumbers.innerHTML = linenumberstext + "<br>";
};

function openCommandDiv(){
	codeDiv.style.display = "none";
	commandDiv.style.display = "block";
	codeBtn.className = "";
	commandBtn.className = "selected";
	minmaxBtn.innerHTML = "<a>_</a>";
}
function openCodeDiv(){
	codeDiv.style.display = "block";
	commandDiv.style.display = "none";
	commandBtn.className = "";
	codeBtn.className = "selected";
	minmaxBtn.innerHTML = "<a>_</a>";
}
function minimize(){
	codeDiv.style.display = "none";
	commandDiv.style.display = "none";
	minmaxBtn.innerHTML = "<a>&#11027;</a>";
}
function maximize(){
	if(commandBtn.className == "selected"){
		openCommandDiv();
	}else{
		openCodeDiv();
	}
}

commandBtn.onclick = function(){
	openCommandDiv();
};
codeBtn.onclick = function(){
	openCodeDiv();
};
minmaxBtn.onclick = function(){
	if(codeDiv.style.display == "none" && commandDiv.style.display == "none"){
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


// line number wrap thing


onkeydown = function(e) {
    if(event.metaKey) {
    	if(e.keyCode == 13) {
			applyScript();
		}else if(e.keyCode == 37) {
			openCodeDiv();
		}else if(e.keyCode == 38) {
			maximize();
		}else if(e.keyCode == 39) {
			openCommandDiv();
		}else if(e.keyCode == 40) {
			minimize();
		}
	}
};

