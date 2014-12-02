define(function(require, exports, module) {

    var inherits = require('../utils/inherits');
    var One = require('./One');
    var MouseEvent = require('./events/MouseEvent');
    var Point = require('../geom/Point')

    var Engine = function(options) {
        this._stage = null;
        this._canvas = null;
        this._debug = true;
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
        var _onResize = function() {
            canvas.width = stage.width = window.innerWidth - (offsetLeft * 2 + 5);
            canvas.height = stage.height = window.innerHeight - (offsetLeft * 2 + 5);
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
        canvas.addEventListener('mousedown', function() {
            _onMouse.apply(null, arguments);
        });

        document.addEventListener('mouseup', function() {
            _onMouse.apply(null, arguments);
        });

        document.addEventListener('mousemove', function() {
            _onMouse.apply(null, arguments);
        });

        canvas.addEventListener('click', _onMouse);
    };

    p.run = function() {
        var me = this;
        var canvas = me._canvas,
            stage = me._stage,
            context = canvas.getContext('2d');

        var lt = Date.now();
        var frame = function() {
            var t1 = Date.now();
            stage._draw(context);
            stage._update();
            var t2 = Date.now();
            var dt = t2 - t1;
            setTimeout(frame, (16.6 - dt) > 0 ? (16.6 - dt) : 0);


            //show debug info
            var fps = 1000 / (Date.now() - lt);
            lt = Date.now();
            if (me._debug) {
                context.save();
                context.fillStyle = '#000000';
                context.font = 'bold 28px Aerial';
                context.fillText('FPS: ' + (((fps * 100) << 0) / 100), 30, 52);
                context.restore();
            };
        }

        frame();
    };

    p.dropable = function() {
        var ctrl = require("./ctrls/DropCtrl");
        return ctrl.init(this._stage);
    };

    p.moveable = function() {
        var ctrl = require("./ctrls/MoveCtrl");
        return ctrl.init(this._stage);
    };

    module.exports = Engine;
});