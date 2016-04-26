# ionejs.js
## Introduction
A full featured rendering engine for html5 canvas.

## Getting Started
We assume that you are familiar with CommonJS API(require and exports) and npm,  
and that you have installed browserify, (webpack) or electron.   

1. create your workspace:
```
  % mkdir hello-ionejs
  $ cd hello-ionejs
```

2. run the command below:
```
  % npm install ionejs  
```

3. create index.html, copy the code below:
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

4. create main.js, copy the code below:
```javascript
var ionejs = require('ionejs');
var stage = new ionejs.Stage();
ionejs.instance.init(stage, document.getElementById('app'));
```

5. run one of the two commands below to start your program.
```
  % cp main.js app.js
  % electron index.html
```
```
  % browserify main.js -o app.js
  % open index.html
```



