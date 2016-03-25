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


    var _lastTarget;

    /**
     * Mouse Event is transfered with capsulation.
     * See {core.events.MouseEvent} for details.
     */
    var _onMouse = function(e) {
        var global = new Point(e.pageX - offsetLeft, e.pageY - offsetTop);
        var target = stage.hit(global);
        if (!target)
            return;
        /**
         * Dispatch event "mouseout"
         * The code below is ambiguous, explicit logic is expected.
         */
        if (_lastTarget && _lastTarget !== target) {
            var local = _lastTarget.globalToLocal(global);
            _lastTarget && _lastTarget.dispatchEvent(new MouseEvent({
                type: "mouseaway",
                global: global,
                local: local
            }));
        }
        _lastTarget = target;

        var local = target.globalToLocal(global);
        target.dispatchEvent(new MouseEvent({
            type: e.type,
            global: global,
            local: local
        }));
    };

    var me = this,
        lp;
    canvas.addEventListener('mousedown', function(e) {
        lp = new Point(e.x, e.y);
        _onMouse.apply(null, arguments);
    });

    document.addEventListener('mouseup', function() {
        _onMouse.apply(null, arguments);
    });

    document.addEventListener('mousemove', function() {
        _onMouse.apply(null, arguments);
    });

    canvas.addEventListener('click', function(e) {
        if (lp.distance(new Point(e.x, e.y)) < 13 /*Why 13? YKI.*/ )
            _onMouse.apply(null, arguments);
    });
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

/**
 * Drop Ctrl, a controller that manages drag and drop.
 * Use new One().mode("dropable") to invoke DND ctrl.
 * This module is going to be remove from ionejs.core and implemented in ionejs-frame
 * and realized in another way besides as a Controller.
 */
p.dropable = function() {
    var ctrl = require("./ctrls/DropCtrl");
    return ctrl.init(this._stage);
};

/**
 * Move Ctrl is also going to be removed.
 */
p.moveable = function() {
    var ctrl = require("./ctrls/MoveCtrl");
    return ctrl.init(this._stage);
};

module.exports = Engine;

