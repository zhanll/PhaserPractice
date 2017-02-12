Game.StartMenu = function(game){
	this.game = game;
	this.load;
	this.cache;
	this.stage;

	this.uiManager = new UIManager(game);

	this.preload = function(){
		this.uiManager.init();
		this.load.json('start_menu', 'client/assets/forms/start_menu.json');
	};

	this.create = function(){
		this.stage.setBackgroundColor('#124184');
		
		this.uiManager.addForm('start_menu');

		this.uiManager.getControl("btn_game").events.onInputDown.add(function(){
			this.game.state.start('GamingLogic');
		},this);
		
		this.uiManager.getControl("btn_map_editor").events.onInputDown.add(function(){
			this.game.state.start('Logic');
		},this);
	};
}