var waveform = require('..');

var audio = new Audio('examples/media/Hydrate-Kenny_Beltrey.ogg');

var canvas = waveform(audio, {"play" : true});

audio.play();
