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



[![NPM](https://nodei.co/npm/rtc-audioproc.png)](https://nodei.co/npm/rtc-audioproc/)

[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)

## Usage with WebRTC

This was primarily written to work with the
[rtc-media](https://github.com/rtc-io/rtc-media) library so here's an
example of how it works there:

```js
var media = require('rtc-media');
var waveform = require('rtc-audioproc');

var localvideo = media();

var videoElement = localvideo.render(document.body);

var canvas = waveform(videoElement, {"stream" : localvideo});
```


## Usage with Audio interface

This example shows how to pipe an audio file into the waveform display.
The canvas will be added to the body element unless you provide a different
element to attach it to.

```js
var waveform = require('rtc-audioproc');

var audio = new Audio('examples/media/Hydrate-Kenny_Beltrey.ogg');

var canvas = waveform(audio, {"play" : true});

audio.play();

```


## Usage with a media element

This example shows how to create a waveform display for a video element.
It also shows how to attach the waveform to a separate element.

```js
var waveform = require('rtc-audioproc');

var body = document.getElementsByTagName('body')[0];
var div = document.createElement('div');
var video = document.createElement('video');

video.src = 'examples/media/sintel_trailer.webm';
video.controls = 'controls';

body.appendChild(div);
body.appendChild(video);


var canvas = waveform(video, {"play" : true, "attach" : div });

video.play();
```


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

## License(s)

### Apache 2.0

Copyright 2014 National ICT Australia Limited (NICTA)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
