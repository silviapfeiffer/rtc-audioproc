var waveform = require('..');

var body = document.getElementsByTagName('body')[0];
var div = document.createElement('div');
var video = document.createElement('video');

video.src = 'examples/media/sintel_trailer.webm';
video.controls = 'controls';

body.appendChild(div);
body.appendChild(video);


var canvas = waveform(video, {"play" : true, "attach" : div });

video.play();