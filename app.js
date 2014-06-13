var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

var page = fs.readFileSync('./index.html', 'utf-8');
var script = fs.readFileSync('./main.js', 'utf-8');
var css = fs.readFileSync('./style.css', 'utf-8');

var server = http.createServer(function(req, res) {
  var data, contentType;
  switch (req.url) {
    case '/index.html':
    case '/':
      data = page;
      contentType = 'text/html';
      break;
    case '/main.js':
      data = script;
      contentType = 'text/javascript';
      break;
    case '/style.css':
      data = css;
      contentType = 'text/css';
      break;
    default:
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.end('404: Not Found');
      return;
  }
  res.writeHead(200, {'Content-Type': contentType});
  res.end(data);
}).listen(process.env.PORT || 3000);

var io = socketio.listen(server);

io.sockets.on('connection', function(socket) {
  console.log('client connected : ' + socket.id);

  socket.on('disconnect', function() {
    console.log('client disconnected');
  });

  socket.on('clicked-carta', function() {
    console.log('clicked-carta message received');
  });
});


var App = new function() {
  this.playerRoomMap = [];
  this.GameHandler = new function() {
    this.games = [];

    this.createNewGame = function(sessionId) {
      var roomNumber = 1; // @todo generate properly
      this.games[roomNumber] = new Game(roomNumber, [sessionId]);
    };

    this.addPlayerToGame = function(roomNumber, sessionId){
      if (!rooms[roomNumber].isPlaying) {
        App.PlayerHandler.players[sessionId].sendToMe('entered-room', roomNumber);
        App.playerRoomMap[sessionId] = roomNumber;
      }
    };
  }

  this.PlayerHandler = new function() {
    this.players = [];

    this.addPlayer = function(sessionId) {
      this.players[sessionId] = new Player(sessionId);
      App.playerRoomMap[sessionId] = 0;
    };

    this.removePlayer = function(sessionId) {
      delete this.players[sessionId];
      delete App.playerRoomMap[sessionId];
    };

    this.getNameBySessionId = function(sessionId) {
      if (typeof this.players[sessionId] !== 'undefined') {
        return false;
      } else {
        return this.players[sessionId].name;
      }
    };
  }
}


var Game = function(roomNumber, sessionIds) {
  this.sessionIds = sessionIds;
  this.currentQuizIndex;
  this.roomNumber = roomNumber;

  var aminoacids = [
    'グリシン',
    'アラニン',
    'バリン',
    'ロイシン',
    'イソロイシン',
    'セリン',
    'トレオニン',
    'プロリン',
    'アスパラギン酸',
    'グルタミン酸',
    'アスパラギン',
    'グルタミン',
    'リジン',
    'アルギニン',
    'システイン',
    'メチオニン',
    'ヒスチジン',
    'フェニールアラニン',
    'チロシン',
    'トリプトファン'
  ];
  this.aminoIndices = [];
  this.aminoIndicesOrig = [];
  var tmp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  var num;
  for (var i = 0; i < 20; i++) {
    num = tmp[Math.floor(Math.random() * tmp.length)];
    this.aminoIndices.push(num);
    this.aminoIndicesOrig.push(num)
    tmp.splice(num, 1);
  }
}

Game.prototype.giveNewQuiz = function() {
  var index = Math.floor(Math.random() * this.aminoIndices.length);
  aminoIndices.splice(index, 1);
  this.currentIndex = index;
  io.sockets.emit('newquiz', {string: this.aminoacids[index]});
}

Game.prototype.checkAnswer = function(index) {
  if (index === this.currentQuizIndex) {
    // スコア追加
  } else {
    // お手つき処理
    this.aminoIndices.push(this.currentQuizIndex);
  }
  if (this.aminoIndices.length === 0) {
    // ゲーム終了
  } else {
    // 新しい問題を出題
  }
}


Player = function(sessionId) {
  this.sessionId = sessionid;
  this.name = 'Guest ' + ('00000' + Math.floor(Math.random() * 100000)).slice(-5);
  this.score = 0;
  this.gainedCartaIds = [];
  this.isSkipped = false;
};

Player.prototype.changeName = function(name) {
  return this.name = name;
}

Player.prototype.addScore = function() {
  return this.score++;
}

Player.prototype.resetScore = function() {
  return this.score = 0;
}

Player.prototype.setSkipped = function() {
  return this.isSkipped = true;
}

Player.prototype.unsetSkipped = function() {
  return this.isSkipped = false;
}
