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
        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;

        /**
         * Currently, the size of stage concerts the size window.
         */
        var _onResize = function(){
            canvas.width = stage.width = window.innerWidth - (offsetLeft*2+5);
            canvas.height = stage.height = window.innerHeight - (offsetLeft*2+5);
        };

        window.addEventListener('resize', _onResize);
        _onResize();

        /**
         * Mouse Event is transfered with capsulation.
         * See {core.events.MouseEvent} for details.
         */
        var _onMouse = function(e) {
            var global = new Point(e.pageX - offsetLeft, e.pageY - offsetTop);
            var target = stage.hit(global);
            if (!target)
                return;
            var local = target.globalToLocal(global);
            target.dispatchEvent(new MouseEvent({
                type: e.type,
                global: global,
                local: local
            }));
        };

        var me = this;
        canvas.addEventListener('mousedown', function(){
            _onMouse.apply(null, arguments);
        });

        document.addEventListener('mouseup', function(){
            _onMouse.apply(null, arguments);
        });

        document.addEventListener('mousemove', function(){
            _onMouse.apply(null, arguments);
        });

        canvas.addEventListener('click', _onMouse);
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