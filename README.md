# ionejs.js
## Introduction
A full featured rendering engine for html5 canvas.

## Quick Start(Linux| Mac)
0.install npm & browserify

1.fetch the draft:
```
  % git clone https://github.com/phyxdown/ionejs-draft.git hello-ionejs
  % cd hello-ionejs
```

2.build & run:
```
  % make
```

3.view the page:
```
  % view localhost:8000 in modern browser.
```
Everything goes smoothly if you see FPS.

## Adding a Writer
Modify main.js:
```javascript

```

## Try transformation
modify main.js:
```javascript

```

## Customized Ones
Ionejs provide native __ones__ like __Stage__, __Writer__, __Painter__, __Cliper__ and __Phantom__, of which __Writer__ and __Painter__ are most useful. Yet in some cases, you will need to create customized __ones__ to apply specific behaviors. Ionejs.One has two abstract methods: __update__ and __draw__, which is intended to be overrride to perform realtime data-sync and view-update, as these two methods are called internally every frame.

1.create RotatingWriter.js, copy the code below:
```javascript

```
2.modify main.js:
```javascript

```



