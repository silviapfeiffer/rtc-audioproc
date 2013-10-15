# rtc-audio

This is a small helper module that allows you to render a canvas
to visualize audio from an audio or video element, or a getUserMedia
stream. It uses the Web Audio API. This can be useful to display
audio visually, or to track down when a video or audio element does
not behave as you expect.



[![NPM](https://nodei.co/npm/rtc-audio.png)](https://nodei.co/npm/rtc-audio/)

[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)

## Usage with WebRTC

This was primarily written to work with the
[rtc-media](https://github.com/rtc-io/rtc-media) library so here's an
example of how it works there:

```js
var media = require('rtc-media');
var waveform = require('rtc-audio');

var localvideo = media();

var videoElement = localvideo.render(document.body);

var canvas = waveform(videoElement, {"stream" : localvideo});
```


## Usage with Audio interface

This example shows how to pipe an audio file into the waveform display.
The canvas will be added to the body element unless you provide a different
element to attach it to.


```js
var waveform = require('rtc-audio');

var audio = new Audio('examples/media/Hydrate-Kenny_Beltrey.ogg');

var canvas = waveform(audio, {"play" : true});

audio.play();

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

Copyright 2013 National ICT Australia Limited (NICTA)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
