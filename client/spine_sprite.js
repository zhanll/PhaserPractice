SpineSprite = function(game, x, y, key){
	this.game = game;
	this.sprite = game.add.sprite(x, y);
	this.spine = game.add.spine(x, y, key);

	this.sprite.width = this.spine.width;
	this.sprite.height = this.spine.height;

	game.physics.arcade.enable(this.sprite);
}

SpineSprite.prototype = {
	update : function(){
		this.spine.x = this.sprite.x;
		this.spine.y = this.sprite.y;
	},

	collide : function(object2, collideCallback, processCallback, callbackContext){
		this.game.physics.arcade.collide(this.sprite, object2, collideCallback, processCallback, callbackContext);
	},

	setAnimationByName : function(trackIndex, animationName, loop){
		this.spine.setAnimationByName(trackIndex, animationName, loop);
	},

	cameraFollow : function(){
		this.game.camera.follow(this.sprite);
	}
}