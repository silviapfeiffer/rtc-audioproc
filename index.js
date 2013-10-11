/* jshint node: true */
/* global document: false */
/* global HTMLVideoElement: false */
'use strict';

var raf = require('cog/raf');

/**
  # rtc-audio

  This is a small helper module that allows you to render a canvas
  for an audio or video element using the Web Audio API. This can be
  useful when you want to display a waveform or a frequency display,
  or to track down when a video or audio element does not behave as
  you expect.

  ## Example Usage

  This was primarily written to work with the
  [rtc-media](https://github.com/rtc-io/rtc-media) library so here's an
  example of how it works there:

  <<< examples/rtc-media.js

  Normally, the `media().render` call will create a `<video>` element in
  the specified target container.  In this case, however, `rtc-canvas`
  intercepts the request and creates it's own fake video element that is
  passed back to the render call.

  ## Using the Processing Pipeline

  A processing pipeline has been included to assist with
  manipulating the canvas on the fly. Adding a processor to the pipeline is
  simply a matter of adding a pipeline processor available on the returned
  fake video:

  ```js
  // add a processor
  canvas.pipeline.add(function(imageData) {
    // examine the pixel data

    // if we've modified the pixel data and want to write that back
    // to the canvas then we must return a truthy value
    return true;
  });
  ```

  A more complete example is shown below:

  <<< examples/grayscale-filter.js

  ## A Note with Regards to CPU Usage

  By default rtc-canvas will draw at 25fps but this can be modified to capture
  at a lower frame rate for slower devices, or increased if you have a
  machine with plenty of grunt.

  ## Reference

  ### canvas(target, opts)

  Create a fake video element for the specified target element.

  - `fps` - the redraw rate of the fake video (default = 25)
  
**/
module.exports = function(target, opts) {
  var canvas = document.createElement('canvas');

  var media = (target instanceof HTMLVideoElement || 
               target instanceof HTMLAudioElement) ?
    target :
    document.createElement('video');

  // if the target is a media element
  if (target === media) {
    // insert the canvas after the media parent element
    media.parentNode.appendChild(canvas);
  }
  // otherwise: error
  else
    return null;

  // initialise the canvas width and height
  canvas.width = (opts || {}).width || 480;
  canvas.height = (opts || {}).height || 100;
  canvas.style.border = "red 1px solid";


  // initialise the canvas pipeline
  media.addEventListener('loadedmetadata', function() {
    createWaveform(canvas, media, opts);
  });

  return canvas;
};


/*
  ### createWaveform(canvas, media, opts) ==> EventEmitter

  Inject the required fake properties onto the canvas and return a
  node-style EventEmitter that will provide updates on when the properties
  change.

*/
function createWaveform(canvas, media, opts) {
  var analyser;
  var audioContext;
  var mediaStreamSource;
  // initialize MediaStream if available
  var stream = (opts || {}).stream.stream || null;

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
    console.log(mediaStreamSource);
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
}
