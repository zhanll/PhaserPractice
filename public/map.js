GameMap = function(name, width, height){
	this.name = name;
	this.width = width;
	this.height = height;
	this.index = [];
	this.data = [];

	for(var row=0; row<height; ++row){
		for(var col=0; col<width; ++col){
			this.data.push(0);
		}
	}

	this.add = function(sp, x, y){
		var newIndex = 0;
		if ((newIndex = this.index.indexOf(sp)) == -1) {
			newIndex = this.index.push(sp);
		}

		++newIndex;

		var pos = y*this.width + x;
		this.data[pos] = newIndex;
	};

	this.del = function(x, y){
		var pos = y*this.width + x;
		this.data[pos] = 0;
	};
}

if (typeof module != 'undefined' &&
	typeof module.exports != 'undefined') {
	module.exports = GameMap;
}
