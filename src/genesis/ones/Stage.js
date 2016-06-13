var definer = require('../../helpers/definer');
var One = require('../../core/One');
var stageActions = require('../actions/stage');

module.exports = definer.define({
    afterCreate: function(options) {
        var I = this;
            I._mounted = true;

        if(I.canvas = document.getElementById(options.id))
		    I.addActions(stageActions);
	},

    testHit: function(point) {
        var I = this, S = I.state;
        var x = point.x,
            y = point.y;
        if (x > 0 && x < S.width && y > 0 && y < S.height) return true;
        return false;
    },

    draw: function(context) {
        var I = this, S = I.state;
        context.fillStyle = S.fillStyle;
        context.fillRect(0, 0, S.width, S.height);
	}
}, One, 'ionejs.Stage');
