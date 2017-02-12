Creature = function(game, x, y, key){
	GameObject.call(this, game, x, y);

	this.movable = new Movable();
	this.visable = new Visable(game, x, y, key);
}

inheritPrototype(Creature, GameObject);