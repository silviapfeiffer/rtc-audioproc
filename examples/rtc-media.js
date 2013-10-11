var media = require('rtc-media');
var waveform = require('..');

var localvideo = media();

var videoElement = localvideo.render(document.body);

var canvas = waveform(videoElement, {"stream" : localvideo});

