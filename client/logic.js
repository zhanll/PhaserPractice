Game.Logic = function(game){
	this.game;
	this.add;
	this.input;
	this.time;
	this.math;
	this.world;
	this.physics;
	this.rnd;
	this.camera;
	this.load;
	this.stage;

	this.lines = [];
	this.mapImgs;
	this.items = [];

	this.keysWASD;
	this.gridWidth;
	this.gridHeight;
	this.socket;
	this.map;

	this.selectedBlock;

	this.mapGroup;
	this.uiManager = new UIManager(game);
}

Game.Logic.prototype = {

	preload:function(){
		this.mapImgs = this.load.spritesheet('desert', 'client/assets/desert.png', 32, 32, 48, 1, 1);
		this.load.image('eject_block', 'client/assets/eject_block.png');
		this.load.image('icy_block', 'client/assets/icy_block.png');
		this.load.image('teleport_block', 'client/assets/teleport_block.png');
		this.load.image('sticky_block', 'client/assets/sticky_block.png');
		this.load.image('born_pos', 'client/assets/born_pos.png');
		this.selectedBlock = {
			asset : 'desert',
			frame : 29
		};

		this.uiManager.init();
		this.load.json('map_editor', 'client/assets/forms/map_editor.json');
	},
  
  	create:function(){
  		this.socket = io();
 
 		this.mapGroup = new Phaser.Group(this.game);
 		//fuck this
 		var inst = this;

  		//fetch map data
  		this.socket.on('map', function(data){
  			inst.gridWidth = data.width;
  			inst.gridHeight = data.height;
  			inst.map = data;
  			inst.onRecvMap();
  			inst.initGui();
  		})

		//register key event
		this.keysWASD = this.input.keyboard.addKeys({'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D});

		/*this.input.onDown.add(function(){

		},this);*/
  	},

  	update:function(){
  		if (this.input.activePointer.leftButton.isDown) {
  			if (this.uiManager.isUIMsg(this.input.activePointer)) {
				return;
			}
			
			var x = Math.floor((this.input.activePointer.x+this.camera.x)/32);
  			var y = Math.floor((this.input.activePointer.y+this.camera.y)/32);

  			if (!this.items[x][y]) {
  				this.items[x][y] = this.add.sprite(x*32, y*32, this.selectedBlock.asset, this.selectedBlock.frame, this.mapGroup);

  				this.socket.emit('map_item_add', {sprite:this.selectedBlock.asset, x:x, y:y});
  			}
  		}
  		else if (this.input.activePointer.rightButton.isDown) {
  			var x = Math.floor((this.input.activePointer.x+this.camera.x)/32);
  			var y = Math.floor((this.input.activePointer.y+this.camera.y)/32);

  			if (this.items[x][y]) {
  				this.items[x][y].destroy();
  				this.items[x][y] = null;
  				
  				this.socket.emit('map_item_del', {x:x, y:y});
  			}
  		}

  		var cameraDeltaX = 0;
  		var cameraDeltaY = 0;
  		if (this.keysWASD.up.isDown) {
  			cameraDeltaY -= 32;
  		}
  		if (this.keysWASD.down.isDown) {
  			cameraDeltaY += 32;
  		}
  		if (this.keysWASD.left.isDown) {
  			cameraDeltaX -= 32;
  		}
  		if (this.keysWASD.right.isDown) {
  			cameraDeltaX += 32;
  		}

  		var oldCameraX = this.camera.x;
  		var oldCameraY = this.camera.y;
  		this.camera.x += cameraDeltaX;
  		this.camera.y += cameraDeltaY;
  		var cameraChangedX = this.camera.x - oldCameraX;
  		var cameraChangedY = this.camera.y - oldCameraY;

  		if (cameraChangedX || cameraChangedY) {
  			for(var iLine in this.lines){
	  			this.lines[iLine].start.add(cameraChangedX, cameraChangedY);
	  			this.lines[iLine].end.add(cameraChangedX, cameraChangedY);
  			}
  		}
  	},

  	render:function(){
  		for(var i in this.lines){
  			this.game.debug.geom(this.lines[i]);
  		}

  		//this.world.bringToTop(this.slickUI.container);

  		this.game.debug.text(Math.floor(this.camera.x/32)+','+Math.floor(this.camera.y/32), 0, 10);
  		this.game.debug.text(Math.floor((this.camera.x+this.game.width)/32)+','+Math.floor((this.camera.y+this.game.height)/32), 880, 910);
  	},
	
	onRecvMap:function(){
		//init world
  		this.world.setBounds(0,0, this.gridWidth*32, this.gridHeight*32);
  		this.stage.setBackgroundColor('#124184');

  		//grid line
  		for(var i=0; i<=this.game.height/32; i++){
  			let line = new Phaser.Line(0, i*32, this.game.width, i*32);
  			this.lines.push(line);
		}
		for(var j=0; j<=this.game.width/32; j++){
			let line = new Phaser.Line(j*32, 0, j*32, this.game.height);
			this.lines.push(line);
		}

		//declare 2d array
		for(var x=0; x<this.gridWidth; x++){
			this.items[x] = new Array(this.gridHeight);
		}

		//init map items
		for(var y=0; y<this.gridHeight; ++y){
			for(var x=0; x<this.gridWidth; ++x){
				var index = y*this.gridWidth + x;
				var indexData = this.map.data[index];
				if (indexData) {
					this.items[x][y] = this.add.sprite(x*32, y*32, this.map.index[indexData-1], 29, this.mapGroup);
				}
			}
		}

		//block edge
		for(var y=0; y<this.gridHeight; y++){
			this.items[0][y] = this.add.sprite(0, y*32, 'desert', 9);
			var x = (this.gridWidth-1)*32;
			this.items[this.gridWidth-1][y] = this.add.sprite(x, y*32, 'desert', 9);
		}
		for(var x=0; x<this.gridWidth; x++){
			this.items[x][0] = this.add.sprite(x*32, 0, 'desert', 9);
			var y = (this.gridHeight-1)*32;
			this.items[x][this.gridHeight-1] = this.add.sprite(x*32, y, 'desert', 9);
		}
	},

	initGui : function(){
		this.uiManager.addForm('map_editor');

		this.uiManager.getControl("block").events.onInputDown.add(function(){
            this.selectedBlock.asset = 'desert';
            this.selectedBlock.frame = 29;
        },this);

        this.uiManager.getControl("eject_block").events.onInputDown.add(function(){
            this.selectedBlock.asset = 'eject_block';
			this.selectedBlock.frame = 0;
        },this);

        this.uiManager.getControl("icy_block").events.onInputDown.add(function(){
            this.selectedBlock.asset = 'icy_block';
			this.selectedBlock.frame = 0;
        },this);

        this.uiManager.getControl("teleport_block").events.onInputDown.add(function(){
            this.selectedBlock.asset = 'teleport_block';
			this.selectedBlock.frame = 0;
        },this);

        this.uiManager.getControl("sticky_block").events.onInputDown.add(function(){
            this.selectedBlock.asset = 'sticky_block';
			this.selectedBlock.frame = 0;
        },this);

        this.uiManager.getControl("born_pos").events.onInputDown.add(function(){
        	this.selectedBlock.asset = 'born_pos';
        	this.selectedBlock.frame = 0;
        },this);

        this.uiManager.getControl("btn_hide").events.onInputDown.add(function(){
            var visible = this.uiManager.getControl("block_list").visible;
            this.uiManager.getControl("block_list").visible = !visible;
            this.uiManager.getControl("btn_hide").x = !visible ? 201 : 0;
        },this);
	}	
};