var definer = require('../../helpers/definer');
var MouseEvent = require('../events/MouseEvent');
var Point = require('../../geom/Point')

module.exports.SupportMousedrag = definer.defineAction({
    focused: false,
    lastGlobal: null,
    lastLocal: null,
    lastPaternal: null,
    afterMount: function() {
        var A = this, I = A.one, P = I.getParent(), S = I.state, stage = I.getStage();
        S.hitable = true;
        I.on('mousedown', function() {
            A.focused = true;
        });
        stage.on('mouseup', function() {
            A.focused = false;
        });
        stage.on('mousemove', function(e) {
            var lastGlobal = A.lastGlobal, 
                lastLocal = A.lastLocal,
                lastPaternal = A.lastPaternal;
            var global = e.global,
                local = e.local,
                paternal = P.globalToLocal(e.global);

            if(A.focused) {
                I.fire(new MouseEvent({
                    type: 'mousedrag',
                    local: local,
                    global: global,
                    localDistance: local.sub(lastLocal),
                    globalDistance: global.sub(lastGlobal),
                    paternalDistance: paternal.sub(lastPaternal)
                }));
            }
            A.lastGlobal = global;
            A.lastLocal = local;
            A.lastPaternal = paternal;
        });
    }
}, "SupportMousedrag");
