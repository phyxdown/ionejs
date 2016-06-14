var definer = require('../../helpers/definer');
var _ = require('underscore');

module.exports = definer.defineOne({
    testHit: function(point) {
        var I = this;
        if (!I.image) return false;
        else {
            var width = I.image.width;
            var height = I.image.height;
            return point.x > 0 && point.x < width && point.y > 0 && point.y < height;
        }
    },
    loadif: function() {
        var I = this;
        var S = this.state;
        if (!I.image) {
            I.image = new Image();
            I.image.src = S.src;
        }
        else if (I.image.src != S.src)
            I.image.src = S.src;
    },
    update: function() {
        var I = this; I.loadif();
    },
    draw: function(context) {
        var I = this; I.image && context.drawImage(I.image, 0, 0);
    }
}, 'Painter');
