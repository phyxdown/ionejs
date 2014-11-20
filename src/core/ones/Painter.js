define(function(require, exports, module) {

    var inherits = require('../../utils/inherits');
    var One = require('../One');

    var Painter = function(options) {
        One.apply(this, arguments);

        var me = this;
        me._image = null;

        var image = new Image();
        image.onload = function() {
            me._image = image;
        }
        image.src = options.src;
    }

    var p = inherits(Painter, One);

    p.draw = function(context) {
        var me = this,
            image = me._image;

        context.drawImage(image, 0, 0);
    }

    module.exports = Painter;
});