var inherits = require('../../utils/inherits');
var One = require('../One');
var _ = require('underscore');

var Stage = function(options) {
    _.defaults(options, {
	    hitable: true,
	    width: 0,
	    height: 0
    });
    One.apply(this, arguments);
}

var p = inherits(Stage, One);

p.testHit = function(point) {
    var state = this._state;
    var x = point.x,
        y = point.y;
    if (x > 0 && x < state.width && y > 0 && y < state.height) {
        return true;
    }
    return false;
};

p.draw = function(context) {
    var state = this._state;
    try {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, state.width, state.height);
    } catch (e) {}
};

module.exports = Stage;
