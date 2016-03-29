var inherits = require('../../utils/inherits');
var One = require('../One');

var Painter = function(options) {
    One.apply(this, arguments);
    var me = this;

    options.src && me.set(options.src);
};

var p = inherits(Painter, One);

/**
 * set _image.src
 * ionejs does not report illegal src, but the browser does.
 * @param {string} src
 */
p.setSrc = function(src) {
    var me = this;
    var image = new Image();
    image.src = src;
    me._image = image;
};

p.setImage = function(image) {
    me._image= image;
};

p.testHit = function(point) {
	var me = this;
	if (!me._image) return false;
	else {
		var width = me._image.width;
		var height = me._image.height;
    		return point.x > 0 && point.x < width && point.y > 0 && point.y < height;
	}
};

p.draw = function(context) {
    var me = this,
        image = me._image;
    context.drawImage(image, 0, 0);
};

module.exports = Painter;
