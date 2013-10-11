# rtc-audio

This is a small helper module that allows you to render a canvas
for an audio or video element using the Web Audio API. This can be
useful when you want to display a waveform or a frequency display,
or to track down when a video or audio element does not behave as
you expect.


[![NPM](https://nodei.co/npm/rtc-audio.png)](https://nodei.co/npm/rtc-audio/)

[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)

## Example Usage

This was primarily written to work with the
[rtc-media](https://github.com/rtc-io/rtc-media) library so here's an
example of how it works there:

```
ERROR: could not find: 
```

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

```
ERROR: could not find: 
```

## A Note with Regards to CPU Usage

By default rtc-canvas will draw at 25fps but this can be modified to capture
at a lower frame rate for slower devices, or increased if you have a
machine with plenty of grunt.

## Reference

### canvas(target, opts)

Create a fake video element for the specified target element.

- `fps` - the redraw rate of the fake video (default = 25)

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
