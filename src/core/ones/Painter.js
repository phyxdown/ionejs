var inherits = require('../../utils/inherits');
var One = require('../One');

var Painter = function(options) {
    One.apply(this, arguments);
};

var p = inherits(Painter, One);

p.testHit = function(point) {
	var I = this;
	if (!I.image) return false;
	else {
		var width = I.image.width;
		var height = I.image.height;
    		return point.x > 0 && point.x < width && point.y > 0 && point.y < height;
	}
};

p.loadif = function() {
    var I = this;
    var S = this.state;
    if (!I.image) {
        I.image = new Image();
        I.image.src = S.src;
    }
    else if (I.image.src != S.src)
        I.image.src = S.src;
};

p.update = function() {
    var I = this; I.loadif();
};

p.draw = function(context) {
    var I = this; I.image && context.drawImage(I.image, 0, 0);
};

module.exports = Painter;
