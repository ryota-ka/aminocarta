$(function() {
  if ($('#cartawrapper').height() + 100 > document.documentElement.clientHeight) {
  }

  var s = io.connect('http://localhost:3000');

  s.on('connect', function() {
    document.body.textContent = 'connected';
  });
  s.on('disconnect', function(client) {
    document.body.textContent = 'disconnected';
  });
});
