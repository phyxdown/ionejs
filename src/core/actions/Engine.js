var inherits = require('../../utils/inherits');
var Action = require('../Action');
var MouseEvent = require('../events/MouseEvent');
var Point = require('../../geom/Point')

var Engine = function(one) {
    Action.apply(this, arguments);
    this.canvas = null;
}

var p = inherits(Engine, Action);

p.afterCreate = function() {
    var stage = this.one;
    var id = stage.id;
    var canvas = document.getElementById(id);

    //Transfer Correct Coordinates
    var offsetLeft = canvas.offsetLeft;
    var offsetTop = canvas.offsetTop;
    var p = canvas.offsetParent;
    while(p) {
	    offsetLeft += p.offsetLeft;
	    offsetTop += p.offsetTop;
	    p = p.offsetParent;
    }
    var _onResize = function() {
        canvas.width = stage.state.width = window.innerWidth - offsetLeft * 2 - 4;
        canvas.height = stage.state.height = window.innerHeight - offsetLeft * 2 - 4;
    };
    window.addEventListener('resize', _onResize);
    _onResize();

    //Transfer Mouse Events
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
                type: "mouseout",
                global: global,
                local: local
            }));
	    target && target.dispatchEvent(new MouseEvent({
                type: "mousein",
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

    var lp;
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

    //Run the Engine
    var context = canvas.getContext('2d');
    var lt = Date.now();
    var frame = function() {
        var t1 = Date.now();
        stage._draw(context);
        stage._update();
        var t2 = Date.now();
        var dt = t2 - t1;
        setTimeout(frame, (1000/stage.fpslimit - dt) > 0 ? (1000/stage.fpslimit - dt) : 0);

        //show debug info
        var fps = 1000 / (Date.now() - lt);
        lt = Date.now();
        if (stage.debug) {
            context.save();
            context.fillStyle = '#000000';
            context.font = 'bold 28px Aerial';
            context.fillText('FPS: ' + (((fps * 100) << 0) / 100), 30, 52);
            context.restore();
        };
    }

    frame();
};

module.exports = Engine;
