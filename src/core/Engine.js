define(function(require, exports, module) {

    var inherits = require('../utils/inherits');
    var One = require('./One');
    var MouseEvent = require('./events/MouseEvent');
    var Point = require('../geom/Point')

    var Engine = function(options) {
        this._stage = null;
        this._canvas = null;
    }

    var p = Engine.prototype;

    /**
     * @param  {core.Stage} stage
     */
    p.init = function(stage, canvas) {
        this._stage = stage;
        this._canvas = canvas;

        canvas.width = stage.width;
        canvas.height = stage.height;
        
        var offsetTop = canvas.offsetTop;
        var offsetLeft = canvas.offsetLeft;

        var listener = function(e) {
            var global = new Point(e.pageX - offsetLeft, e.pageY - offsetTop);
            var origin = stage.hit(global);
            if (!origin)
                return;
            var local = origin.globalToLocal(global);
            origin.dispatchEvent(new MouseEvent({
                type: e.type,
                global: global,
                local: local
            }));
        }

        var me = this;
        canvas.addEventListener('mousedown', function(){
            me._down = true;
            listener.apply(null, arguments);
        });

        canvas.addEventListener('mouseup', function(){
            me._down = false;
            listener.apply(null, arguments);
        });

        canvas.addEventListener('mousemove', function(){
            me._down && listener.apply(null, arguments);
        });

        canvas.addEventListener('click', listener);
    };

    p.run = function() {
        var canvas = this._canvas,
            stage = this._stage,
            context = canvas.getContext('2d');

        var frame = function(){
            //draw
            stage._draw(context);
            //update
            //stage._update();
            setTimeout(frame, 1000/60);
        }

        frame();
    };

    module.exports = Engine;
});