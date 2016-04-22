var inherits = require('../../utils/inherits');
var One = require('../One');

var Painter = function(options) {
    One.apply(this, arguments);
};

var p = inherits(Painter, One);

p.testHit = function(point) {
	var state = this.state;
	if (!state.image) return false;
	else {
		var width = state.image.width;
		var height = state.image.height;
    		return point.x > 0 && point.x < width && point.y > 0 && point.y < height;
	}
};

p.loadif = function() {
    var state = this.state;
    if (!state.image) {
        state.image = new Image();
        state.image.src = state.src;
    }
    else if (state.image.src != state.src)
        state.image.src = state.src;
};

p.update = function() {
    this.loadif();
};

p.draw = function(context) {
    this.state.image && context.drawImage(this.state.image, 0, 0);
};

module.exports = Painter;
