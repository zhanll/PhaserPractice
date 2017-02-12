var id = 1;

GameObject = function(game, x, y){
	this.game = game;
	this.id = ++id;
	this.x	= x;
	this.y 	= y;
	
	this.movable	= null;
	this.visable	= null;
}

if (typeof module != 'undefined' &&
	typeof module.exports != 'undefined') {
	module.exports = GameObject;
}
