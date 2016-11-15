var submit = document.getElementById("submitCode");
var code = document.getElementById("code");
var codeDiv = document.getElementById("codeDiv");
var command = document.getElementById("command");
var commandDiv = document.getElementById("commandDiv");
var buttonbar = document.getElementById("buttonbar");
var commandBtn = document.getElementById("commandBtn");
var codeBtn = document.getElementById("codeBtn");
var minmaxBtn = document.getElementById("minmax");

function requireFromString(src, filename) {
  var Module = module.constructor;
  var m = new Module();
  m._compile(src, filename);
  return m.exports;
}

submit.onclick = function(){
	codeString = code.value+"\nloop();";
	robot1.step = new Function(codeString);
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

commandBtn.onclick = function(){
	openCommandDiv();
};
codeBtn.onclick = function(){
	openCodeDiv();
};
minmaxBtn.onclick = function(){
	if(codeDiv.style.display == "none" && commandDiv.style.display == "none"){
		if(commandBtn.className == "selected"){
			openCommandDiv();
		}else{
			openCodeDiv();
		}
	}else{
		codeDiv.style.display = "none";
		commandDiv.style.display = "none";
		minmaxBtn.innerHTML = "<a>&#11027;</a>";
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
		dragy = e.clientY;
	}
};
