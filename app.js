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
  console.log('client connected');

  socket.on('disconnect', function() {
    console.log('client disconnected');
  });

  socket.on('clicked-carta', function() {
    console.log('clicked-carta message received');
  });
});

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
