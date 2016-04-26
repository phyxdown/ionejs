# ionejs.js
## Introduction
A full featured rendering engine for html5 canvas.

## Quick Start
If you are familiar with CommonJS API(require and exports) and npm, skip __step 0__. Basically, you will need to run few commands to init your environment and create two files(index.html and main.js) to get started.

0.install electron:
```
  % npm install electron -g
```
__or__ install brwoserify:
```
  % npm install brwoserify -g
```

1.create workspace:
```
  % mkdir hello-ionejs(or abcde)
  % cd hello-ionejs
```

2.install ionejs:
```
  % npm install ionejs  
```

3.create index.html:
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

4.create main.js:
```javascript
var ionejs = require('ionejs');
var stage = new ionejs.Stage();
ionejs.instance.init(stage, document.getElementById('app'));
ionejs.instance.run();
```

5.choose one of the two ways to start.
```
  % cp main.js app.js
  % electron index.html
```
```
  % browserify main.js -o app.js
  % open index.html
```
If you see FPS, the environment is init properly.

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
Ionejs provide native __ones__ like __Stage__, __Writer__, __Painter__, __Cliper__ and __Phantom__, of which __Writer__ and __Painter__ are most useful. Yet in some cases, you will need to create customized __ones__ to apply specific behaviors. Ionejs.One has two abstract methods: __update__ and __draw__, which is intended to be overrride to perform realtime data-sync and view-update, as these two methods are called internally every frame(60 times per second).

1.create RotatingWriter.js, copy the code below:
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
2.modify main.js:
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



