$(function() {
  var $cartas = $('.carta');
  console.dir($cartas);
  if ($('#cartawrapper').height() + 100 > document.documentElement.clientHeight) {
  }

  var s = io.connect('http://localhost:3000');

  s.on('connect', function() {
  });
  s.on('disconnect', function(client) {
  });

  $cartas.click(function() {
    s.emit('clicked-carta', {index: $cartas.index(this)});
    console.log($cartas.index(this));
  });
});
