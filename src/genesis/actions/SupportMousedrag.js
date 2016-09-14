var definer = require('../../helpers/definer');
var MouseEvent = require('../events/MouseEvent');
var Point = require('../../geom/Point')

module.exports.SupportMousedrag = definer.defineAction({
    focused: false,
    afterMount: function() {
        var A = this,  I = A.one, stage = I.getStage();
        I.on('mousedown', function() {
            A.focused = true;
        });
        stage.on('mouseup', function() {
            A.focused = false;
        });
        stage.on('mouseout', function() {
            A.focused = false;
        });
        stage.on('mousemove', function(e) {
            if(A.focesed)
                console.log(e);
        });
    }
}, "SupportMousedrag");
