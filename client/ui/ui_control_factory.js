UIControlFactory = function(game){
	this.game = game;

	this.button = function(para, container){
		var wid = para.width;
		var hei = para.height;

		var x = para.x;
		var y = para.y;

		if (x === "center") {
			x = Math.floor( (this.game.width - wid) / 2 );
		}

		if (y === "center") {
			y = Math.floor( (this.game.height - hei) / 2 );
		}

		var btn;
		container.add(btn = new SlickUI.Element.Button(x, y, wid, hei));
		btn.add(new SlickUI.Element.Text(0, 0, para.text)).center();
		return btn;
	};

	this.panel = function(para, container, controlList){
		var wid = para.width;
		var hei = para.height;

		var x = para.x;
		var y = para.y;

		if (x === "center") {
			x = Math.floor( (this.game.width - wid) / 2 );
		}

		if (y === "center") {
			y = Math.floor( (this.game.height - hei) / 2 );
		}

		var pnl;
		container.add(pnl = new SlickUI.Element.Panel(x, y, wid, hei));

		for (var i in para.children) {
			var childObj = para.children[i];
			controlList[childObj.name] = this.button(childObj, pnl);
		}

		return pnl;
	};
}