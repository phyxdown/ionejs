var definer = require('../../helpers/definer');
var _ = require('underscore');

module.exports = definer.defineOne({
    draw: function(context) {
        var I = this, S = I.state;
        context.beginPath(); 
        context.rect(S.startX, S.startY, S.width, S.height);
        context.clip();
        context.closePath();
    }
}, 'ionejs.Cliper');
