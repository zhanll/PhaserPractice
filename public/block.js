Block = function(game, x, y, key){
	GameObject.call(this, game, x, y);

	this.visable = new Visable(game, x, y, key);
}

inheritPrototype(Block, GameObject);