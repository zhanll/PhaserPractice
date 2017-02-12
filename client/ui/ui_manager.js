UIManager = function(game){
	this.game = game;
	this.slickUI = null;
	this.uiAdd = new UIControlFactory(this.game);
	this.allControls = {};
	this.rootControls = [];

	//invoke by stage preload
	this.init = function(){
		this.slickUI = this.game.plugins.add(Phaser.Plugin.SlickUI);
		this.slickUI.load('client/assets/kenney/kenney.json');
	};

	this.addForm = function(key){
		var form = this.game.cache.getJSON(key);

		for (var i in form.controls){
			var conObj = form.controls[i];
			if (conObj.type == "button") {
				this.allControls[conObj.name] = this.uiAdd.button(conObj, this.slickUI);
			}
			else if (conObj.type == "panel") {
				this.allControls[conObj.name] = this.uiAdd.panel(conObj, this.slickUI, this.allControls);
			}
			this.rootControls.push(this.allControls[conObj.name]);
		}		
	};

	this.getControl = function(name){
		return this.allControls[name];
	};

	this.isUIMsg = function(point){
		for(var i in this.rootControls){
			var curControl = this.rootControls[i];
			if (typeof curControl.visible == 'undefined' || curControl.visible) {
				if (point.x >= curControl.x && point.x <= curControl.x + curControl.width
					&& point.y >= curControl.y && point.y <= curControl.y + curControl.height) {
					return true;
				}
			}
		}
		return false;
	};
}