var definer = require('../../helpers/definer');
var MouseEvent = require('../events/MouseEvent');
var Point = require('../../geom/Point')

module.exports.SupportMousedrag = definer.defineAction({
    focused: false,
    afterMount: function() {
        var A = this,  I = A.one, S = I.state, stage = I.getStage();
        console.log(A, I, S, stage)
        S.hitable = true;
        I.on('mousedown', function() {
            A.focused = true;
        });
        stage.on('mouseup', function() {
            A.focused = false;
        });
        stage.on('mouseout', function(e) {
            if(e.target == stage)
                A.focused = false;
        });
        stage.on('mousemove', function(e) {
            if(A.focused) {
                I.fire(new MouseEvent({
                    type: 'mousedrag',
                    local: e.local,
                    global: e.global
                }));
            }
        });
    }
}, "SupportMousedrag");
