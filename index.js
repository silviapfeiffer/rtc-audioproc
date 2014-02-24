/* jshint node: true */
/* global document: false */
/* global HTMLVideoElement: false */
'use strict';

var raf = require('cog/raf');

/**
  # rtc-audioproc

  This is a small helper module that allows you to render a canvas
  to visualize audio from an audio or video element, or a getUserMedia
  stream. It uses the Web Audio API. This can be useful to display
  audio visually, or to track down when a video or audio element does
  not behave as you expect.

  BROWSER SUPPORT:
  * Chrome is the only browser that has support for Web Audio & WebRTC
  * works in Chrome for getUserMedia(), Audio(), audio and video elements
  * broken in Chrome for PeerConnection, see https://code.google.com/p/chromium/issues/detail?id=121673


  ## Usage with WebRTC

  This was primarily written to work with the
  [rtc-media](https://github.com/rtc-io/rtc-media) library so here's an
  example of how it works there:

  <<< examples/rtc-media.js


  ## Usage with Audio interface

  This example shows how to pipe an audio file into the waveform display.
  The canvas will be added to the body element unless you provide a different
  element to attach it to.

  <<< examples/new-audio.js


  ## Usage with a media element

  This example shows how to create a waveform display for a video element.
  It also shows how to attach the waveform to a separate element.

  <<< examples/video-element.js


  ## Parameters for waveform

  * target : media element or Audio instance 
  * opts:
    * width : the width of the canvas
    * height : the height of the canvas
    * stream : if you're using WebRTC, you need to hand in the MediaStream directly
    * play : if set to true, also route the audio to the output device
    * attach : element to which the canvas will be added as a child

  ## Running the examples

  You can use [beefy](http://didact.us/beefy/) to run the examples, e.g.

  $ beefy examples/rtc-media.js

  
**/
module.exports = function(target, opts) {
  var canvas = document.createElement('canvas');

  var media = (target instanceof HTMLVideoElement || 
               target instanceof HTMLAudioElement) ?
    target :
    document.createElement('video');

  var attach = (opts || {}).attach;

  // attach canvas to DOM
  if (attach) {
    // if there is an attach element, use that
    attach.appendChild(canvas);
  } else if (target === media && media.parentNode) {
    // insert the canvas into the media parent element
    media.parentNode.appendChild(canvas);
  } else {
    // fallback: insert canvas after body
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);
  }

  // initialise the canvas width and height
  canvas.width = (opts || {}).width || 480;
  canvas.height = (opts || {}).height || 100;
  canvas.style.border = 'red 1px solid';


  // initialise the canvas pipeline
  media.addEventListener('loadedmetadata', function() {
    createWaveform(canvas, media, opts);
  });

  return canvas;
};


/*
  ### createWaveform(canvas, media, opts) ==> EventEmitter

  Push the audio through the drawing loop and display the waveform
  in the canvas.

*/
function createWaveform(canvas, media, opts) {
  var analyser;
  var audioContext;
  var mediaStreamSource;
  // initialize MediaStream if available
  var stream = ((opts || {}).stream || {}).stream || null;

  var context = canvas.getContext('2d');


  // convert from stereo to mono
  function convertToMono(input) {
    // access the two channels
    var splitter = audioContext.createChannelSplitter(2);

    // prepare to merge 2 inputs
    var merger = audioContext.createChannelMerger(2);

    // connect the splitter to the input stream
    input.connect( splitter );
    // connect the merger to the splitters
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );

    // return the merged stream
    return merger;
  }

  function draw() {
    var width, height, waveData, barCount, barHeight, loopStep, value;

    width = canvas.width;
    height = canvas.height;

    // Create arrays to store sound data
    waveData = new Uint8Array(analyser.fftSize);

    // Retrieve data; max value is 128 (it's a byte ;-)
    analyser.getByteTimeDomainData(waveData);

    context.clearRect(0, 0, width, height);

    barCount = Math.round(width);
    loopStep = Math.floor(waveData.length / barCount);

    for (var i = 0; i < barCount; i++) {
      value = waveData[i * loopStep];
      // scale to canvas height, then position in middle of canvas
      barHeight = (1.0 - value/128)*(height/2) + 1;
      context.fillRect(i, (height/2)-barHeight, 1, 2*barHeight);
    }

    raf(draw);
  }


  // Create an AudioNode from the stream.
  audioContext = new webkitAudioContext();

  if (stream) {
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
  } else {
    mediaStreamSource = audioContext.createMediaElementSource(media);
  }

  // route media stream to a mono-converter
  var monoStream = convertToMono(mediaStreamSource);

  // route mono stream to a frequence analyser
  analyser = audioContext.createAnalyser();
  monoStream.connect(analyser);

  // start the drawing loop
  draw();

  // start playback if requested
  if ((opts || {}).play) {
    analyser.connect(audioContext.destination);
  }
}
