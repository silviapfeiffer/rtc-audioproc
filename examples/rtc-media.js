var camera = require('rtc-media');
var waveform = require('..');

var localvideo = camera();

var videoElement = localvideo.render(document.body);

var canvas = waveform(videoElement, {"stream" : localvideo});

