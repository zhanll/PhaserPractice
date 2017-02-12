GameAbility = function(name){
	this.name = name;

	this.getAbility = function(){
		if (this.name == "Movable") {
			return new Movable();
		}
	};
}