Files = {

	_files: [],
	_level: 1,
	_file_prepend: 'js_robot_file_',
	_level_prepend: 'js_robot_level_',

	validFileName:
	function(name){
		
	},

	setLevel:
	function(l){
		this._level = l;
	},

	files:
	function(){
		this._retrieve();
		levelFile = 'level-' + this._level;
		return [levelFile].concat(this._files);
	},

	add:
	function(name){
		if(name === ''){
			return false;
		}
		if(this.find(name) != -1){
			return false;
		}
		this._files.push(name);
		this.save(this._files.length, {});
		return true;
	},

	rename:
	function(n, name){
		if(n === 0 || name === ''){
			return false;
		}
		if(this.find(name) != -1){
			return false;
		}
		var content = this.file(n);
		this.erase(n);
		this._files[n - 1] = name;
		this.save(n, content);
		return true;
	},

	erase:
	function(n){
		if(n <= this._files.length && n > 0){
			localStorage.removeItem(this._file_prepend + this._files[n-1]);
			//this._files.splice(n - 1, 1);
			return true;
		}
		return false;
	},

	file:
	function(n){
		if(n === 0){
			content = localStorage.getItem(this._level_prepend + this._level);
			if(!content){
				return null;
			}
			return JSON.parse(content);
		}else if(n > this._files.length){
			return false;
		}else{
			content = localStorage.getItem(this._file_prepend + this._files[n - 1]);
			if(!content || content == "{}"){
				return null;
			}else{
				return JSON.parse(content);
			}
		}
	},

	save:
	function(n, content){
		if(n > files.length){
			return false;
		}else if(n === 0){
			localStorage.setItem(this._level_prepend + this._level,
				JSON.stringify(content));
		}else{
			localStorage.setItem(this._file_prepend + this._files[n - 1],
				JSON.stringify(content));
		}
		return true;
	},

	find:
	function(name){
		for(var i in this._files){
			if(name === this._files[i]){
				return (Number(i) + 1);
			}
		}
		return -1;
	},

	_retrieve:
	function(){
		var files = [];
		var allFiles = Object.keys(localStorage);
		for(var i in allFiles){
			var f = allFiles[i];
			if(f.length > this._file_prepend.length &&
					f.slice(0, this._file_prepend.length) == this._file_prepend &&
					localStorage[f] !== undefined){
				var fileName = f.slice(this._file_prepend.length);
				files.push(fileName);
			}
		}
		this._files = files;
		return (files.length > 0);
	}

};
