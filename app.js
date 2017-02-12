var express = require("express");
var app = express();
var serv = require('http').Server(app);
var mongojs = require('mongojs');
var db = mongojs('gameDb');
var mapCollection = db.collection('map');
var GameMap = require('./public/map.js');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/public', express.static(__dirname + '/public'));
app.use('/client', express.static(__dirname + '/client'));


serv.listen(2000);

console.log("server started at port: 2000");

var gameMap = new GameMap("desert", 64, 64);

///////
var io = require('socket.io')(serv);
io.sockets.on('connection', function(socket){
	console.log('socket connection');

	mapCollection.find({name:"desert"}, function(err, res){
		if(!err && res.length > 0){
			gameMap.name = res[0].name;
			gameMap.width = res[0].width;
			gameMap.height = res[0].height;
			gameMap.index = res[0].index;
			gameMap.data = res[0].data;
		}
	});

	socket.emit('map', gameMap);

	socket.on('map_item_add', function(data){
		console.log('on msg map_item_add');

		gameMap.add(data.sprite, data.x, data.y);
	});

	socket.on('map_item_del', function(data){
		console.log('on msg map_item_del');

		gameMap.del(data.x, data.y);
	});

	var intervalObj = setInterval(function(){
		console.log("database update");
		mapCollection.update({name:gameMap.name}, {$set:{index:gameMap.index,data:gameMap.data}});
	}, 5000);

	socket.on('disconnect', function () {
    	console.log("socket disconnect");
    	clearInterval(intervalObj);
  });
});