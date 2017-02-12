Movable = function(){
	this.moveSpeed = 0;
	this.moveDirection = Movable.DIR_RIGHT;
	this.jumpSpeed = 0;
	this.inAir = false;
}

Movable.prototype = {
	moveLeft : function(){
		this.moveDirection = Movable.DIR_LEFT;
	},

	moveRight : function(){
		this.moveDirection = Movable.DIR_RIGHT;
	},

	jump : function(){
		if (this.inAir) {
			return;
		}
		
		this.inAir = true;
	}
}

Movable.DIR_LEFT = 1;
Movable.DIR_RIGHT = 2;
