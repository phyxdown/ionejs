var inherits = require('../../utils/inherits');
var One = require('../One');

var Painter = function(options) {
    One.apply(this, arguments);
};

var p = inherits(Painter, One);

p.testHit = function(point) {
	var me = this;
	if (!me._image) return false;
	else {
		var width = me._image.width;
		var height = me._image.height;
    		return point.x > 0 && point.x < width && point.y > 0 && point.y < height;
	}
};

p.loadif = function() {
    if (!this._state.image) {
        this._state.image = new Image();
        this._state.image.src = this._state.src;
    }
    else if (this._state.image.src != this._state.src)
        this._state.image.src = this._state.src;
};

p.update = function() {
    this.loadif();
};

p.draw = function(context) {
    context.drawImage(this._state.image, 0, 0);
};

module.exports = Painter;
