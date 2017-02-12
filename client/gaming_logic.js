Game.GamingLogic = function(game){
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

	this.mapImgs;
	this.items = [];

	this.keysWASD;
	this.gridWidth;
	this.gridHeight;
	this.socket;
	this.map;

	this.selectedBlock;

	this.mapGroup;
  this.role = null;
  this.born_pos = {};
}

Game.GamingLogic.prototype = {

	preload:function(){
    this.add.plugin(PhaserSpine.SpinePlugin);

		this.mapImgs = this.load.spritesheet('desert', 'client/assets/desert.png', 32, 32, 48, 1, 1);
		this.load.image('eject_block', 'client/assets/eject_block.png');
		this.load.image('icy_block', 'client/assets/icy_block.png');
		this.load.image('teleport_block', 'client/assets/teleport_block.png');
		this.load.image('sticky_block', 'client/assets/sticky_block.png');
		this.load.image('born_pos', 'client/assets/born_pos.png');
    this.load.spritesheet('role_walk', 'client/assets/simon.png', 58, 96);
    this.load.spine('spineboy', 'client/assets/animations/spineboy.json');
		this.selectedBlock = {
			asset : 'desert',
			frame : 29
		};
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
		})

		//register key event
		this.keysWASD = this.input.keyboard.addKeys({'up': Phaser.KeyCode.W, 'down': Phaser.KeyCode.S, 'left': Phaser.KeyCode.A, 'right': Phaser.KeyCode.D});

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 250;
  },

	update:function(){
    /*this.physics.arcade.collide(this.role, this.mapGroup, function(role, target){
      if (targe.y >= role.y) {
        this.role.movable.inAir = false;
      }
    });*/

    if (this.role) {
      this.role.collide(this.mapGroup, function(role, target){});
      this.role.update();
    }

    var keyDown = false;
		if (this.keysWASD.up.isDown) {
      //this.role.body.velocity.y = -200;
      //this.role.y -= 4;
      //this.role.animations.play('right');
      this.role.sprite.y -= 4;;
      keyDown = true;
    }
    if (this.keysWASD.down.isDown) {
      //this.role.body.velocity.y = 200;
      //this.role.y += 4;
      //this.role.animations.play('right');
      keyDown = true;
    }
    if (this.keysWASD.left.isDown) {
      //this.role.body.velocity.x = -200;
      //this.role.x -= 4;
      //this.role.animations.play('left');
      this.role.sprite.body.velocity = -200;
      this.role.setAnimationByName(0, "walk", true);
      keyDown = true;
    }
    if (this.keysWASD.right.isDown) {
      //this.role.body.velocity.x = 200;
      //this.role.x += 4;
      //this.role.animations.play('right');
      //this.role.setAnimationByName(0, "walk", true);
      this.role.sprite.x += 4;
      this.role.setAnimationByName(0, "walk", true);
      keyDown = true;
    }

    if (this.role && !keyDown) {
      //this.role.body.velocity.x = 0;
      //this.role.body.velocity.y = 0;
      //this.role.animations.stop();

      this.role.sprite.body.velocity.x = 0;
    }
	},

	render:function(){
    if (this.role && this.game.debug.spriteBounds) {
      this.game.debug.spriteBounds(this.role.spine);
      this.game.debug.spriteBounds(this.role.sprite);

      this.game.debug.text(this.role.spine.x + ',' + this.role.spine.y, 0, 50);
      this.game.debug.text(this.role.spine.width + ',' + this.role.spine.height, 0, 100);
      this.game.debug.text(this.role.sprite.x + ',' + this.role.sprite.y, 0, 200);
      this.game.debug.text(this.role.sprite.width + ',' + this.role.sprite.height, 0, 250);
    }
	},
	
	onRecvMap:function(){
		//init world
		this.world.setBounds(0,0, this.gridWidth*32, this.gridHeight*32);
		this.stage.setBackgroundColor('#124184');

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
          if (this.map.index[indexData-1] == "born_pos") {
            this.born_pos.x = x;
            this.born_pos.y = y;
          }
				}
			}
		}

		//block edge
		for(var y=0; y<this.gridHeight; y++){
			this.items[0][y] = this.add.sprite(0, y*32, 'desert', 9);
			var x = (this.gridWidth-1)*32;
			this.items[this.gridWidth-1][y] = this.add.sprite(x, y*32, 'desert', 9, this.mapGroup);
		}
		for(var x=0; x<this.gridWidth; x++){
			this.items[x][0] = this.add.sprite(x*32, 0, 'desert', 9);
			var y = (this.gridHeight-1)*32;
			this.items[x][this.gridHeight-1] = this.add.sprite(x*32, y, 'desert', 9, this.mapGroup);
		}

    //create role
    //this.role = this.add.sprite(this.born_pos.x*32+16, this.born_pos.y*32+32, 'role_walk', 1);
    //this.role = this.add.spine(this.born_pos.x*32+16, this.born_pos.y*32+32, 'spineboy');
    /*this.camera.follow(this.role);
    this.role.anchor.setTo(0.5, 1);
    this.role.scale.setTo(0.5, 0.5);
    this.role.animations.add('right', [0,1,2,3,4], 10, true);
    this.role.animations.add('left', [4,3,2,1,0], 10, true);
    this.physics.enable(this.role, Phaser.Physics.ARCADE);
    this.role.body.collideWorldBounds = true;
    this.role.body.allowGravity = true;*/
    this.role = new SpineSprite(this.game, this.born_pos.x*32+16, this.born_pos.y*32+32, 'spineboy');
    this.camera.follow(this.role.sprite);
    this.role.sprite.anchor.setTo(0.5, 1);
    this.role.sprite.body.collideWorldBounds = true;
    this.role.sprite.body.allowGravity = true;

    //scene physics
    this.physics.arcade.enable(this.mapGroup);
    this.mapGroup.setAllChildren("body.immovable", true);
    this.mapGroup.setAllChildren("body.allowGravity", false);
	}
};