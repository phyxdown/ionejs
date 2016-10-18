var definer = require('../../helpers/definer');
var MouseEvent = require('../events/MouseEvent');
var Point = require('../../geom/Point')

//AnimationFrame is the most important Action of ionejs.
module.exports.AnimationFrame = definer.defineAction({
    afterCreate: function() {
        var A = this, I = A.one, S = I.state, canvas = I.canvas, context = canvas.getContext('2d');
        var timer = performance || Date;
        var lt = timer.now();
        var accumulate = Number.MAX_VALUE;
        var fps = 0;
        var time
        var frame = function() {
            var t1 = timer.now();
            I._draw(context);
            I._update();
            var t2 = timer.now();
            var dt = t2 - t1;
            if(S.fpslimit != 60)
                setTimeout(frame, (1000/S.fpslimit - dt) > 0 ? (1000/S.fpslimit - dt) : 0);
            else requestAnimationFrame(frame);

            //show debug info
            if (S.debug) {
                var interval = timer.now() - lt;
                lt = timer.now();
                if (accumulate > 500) {
                    fps = 1000 / interval;
                    time = dt;
                    accumulate = 0;
                }
                accumulate += interval;
                context.save();
                context.fillStyle = '#000000';
                context.font = 'bold 28px Aerial';
                context.fillText('FPS: ' + ((((fps * 100) << 0) / 10) << 0) / 10 + ' Time: ' + (((time * 100) << 0) / 10 << 0) / 10 + 'ms', 30, 52);
                context.restore();
            };
        }
        frame();
    }
}, 'stage.AnimationFrame');

module.exports.AutoResize = definer.defineAction(function(){
    var A = this, I = A.one, S = I.state, canvas = I.canvas;
    var offsetLeft = canvas.offsetLeft;
    var offsetTop = canvas.offsetTop;
    var p = canvas.offsetParent;
    while(p) {
        offsetLeft += p.offsetLeft;
        offsetTop += p.offsetTop;
        p = p.offsetParent;
    }

    S.width = window.innerWidth - offsetLeft * 2;
    S.height = window.innerHeight - offsetLeft * 2;

    if(S.width != canvas.width) canvas.width = S.width;
    if(S.height != canvas.height) canvas.height = S.height;
}, 'stage.AutoResize');

module.exports.MouseSensitive = definer.defineAction({
    afterCreate: function() {
        var A = this, I = A.one, S = I.state, canvas = I.canvas;

        var offsetLeft = canvas.offsetLeft;
        var offsetTop = canvas.offsetTop;
        var p = canvas.offsetParent;
        while(p) {
            offsetLeft += p.offsetLeft;
            offsetTop += p.offsetTop;
            p = p.offsetParent;
        }

        var _lastTarget;
        var _onMouse = function(e) {
            var global = new Point(e.pageX - offsetLeft, e.pageY - offsetTop);
            var target = I.hit(global);
            if (!target)
                return;
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

        var lastPoint;
        canvas.addEventListener('mousedown', function(e) {
            lastPoint = new Point(e.clientX, e.clientY);
            _onMouse.apply(null, arguments);
        });

        document.addEventListener('mouseup', function() {
            _onMouse.apply(null, arguments);
        });

        document.addEventListener('mousemove', function() {
            _onMouse.apply(null, arguments);
        });

        canvas.addEventListener('click', function(e) {
            if (lastPoint.distance(new Point(e.clientX, e.clientY)) < 13 /*Why 13? YKI.*/ )
                _onMouse.apply(null, arguments);
        });
    }
}, 'stage.MouseSensitive');
