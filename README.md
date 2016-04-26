# ionejs.js
## Introduction
A full featured rendering engine for html5 canvas.

## Quick Start
We assume that you are familiar with CommonJS API(require and exports) and npm,  
or that you have installed browserify, (webpack) or electron.
0. run the following command to install electron:
```
  % npm install electron -g
```
or the following command to install brwoserify:
```
  % npm install brwoserify -g
```

1.create your workspace:
```
  % mkdir hello-ionejs
  % cd hello-ionejs
```

2.run the command below:
```
  % npm install ionejs  
```

3.create index.html, copy the code below:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
  </head>
  <body>
    <canvas id="app"></canvas>
    <script src="app.js"></script>
  </body>
</html>
```

4.create main.js, copy the code below:
```javascript
var ionejs = require('ionejs');
var stage = new ionejs.Stage();
ionejs.instance.init(stage, document.getElementById('app'));
ionejs.instance.run();
```

5.run one of the two commands below to start your program.
```
  % cp main.js app.js
  % electron index.html
```
```
  % browserify main.js -o app.js
  % open index.html
```
Draft doc doesn't explain too much. If you see FPS, the environment is init properly.

## Adding a Writer
Modify main.js:
```javascript
var ionejs = require('ionejs');
var stage = new ionejs.Stage();
var writer = new ionejs.Writer({
  prefix: 'hello',
  text: 'ionejs'
});
stage.addChild(writer);
ionejs.instance.init(stage, document.getElementById('app'));
ionejs.instance.run();
```

## Try transformation
modify main.js:
```javascript
var ionejs = require('ionejs');
var stage = new ionejs.Stage();
var writer = new ionejs.Writer({
  prefix: 'hello',
  text: 'ionejs',
  x: 100,
  y: 200,
  regX: -10,
  regY: -10,
  rotation: 30,
  scaleX: 1.2,
  scaleY: 0.8,
  skewX: 30,
  skewY: 30
});
stage.addChild(writer);
ionejs.instance.init(stage, document.getElementById('app'));
ionejs.instance.run();
```

## Customized Ones
Ionejs provide native ones like Stage, Writer, Painter, Cliper and Phantom, of which  
Writer and Painter are most useful.  Yet in some cases, you will need to create customized  
to apply specific behaviors. Ionejs.One has two abstract methods: update and draw, which is  
intended to be overrride to perform realtime data-sync and view-update, as ionejs.One.draw  
and ionejs.One.update is called internally every frame(60 times per second).

create RotatingWriter.js, copy the code below:
```javascript
var ionejs = require('ionejs');
var RotatingWriter = function() {
  ionejs.Writer.apply(this, arguments);
}

var p = ionejs.inherits(RotatingWriter, ionejs.Writer);

p.update = function() {
  this.state.rotation += 1;
}

module.exports = RotatingWriter;
```
and modify main.js:
```javascript
var ionejs = require('ionejs');
var RotatingWriter = require('./RotatingWriter');
var stage = new ionejs.Stage();
var writer = new RotatingWriter({
  prefix: 'hello',
  text: 'ionejs',
  x: 100,
  y: 200,
  regX: -10,
  regY: -10,
  rotation: 30,
  scaleX: 1.2,
  scaleY: 0.8,
  skewX: 30,
  skewY: 30
});
stage.addChild(writer);
ionejs.instance.init(stage, document.getElementById('app'));
ionejs.instance.run();
```



