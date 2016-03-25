var inherits = require('../../utils/inherits');
var One = require('../One');

var Stage = function(options) {
    One.apply(this, arguments);
    this.parent = null;
    this._hitable = true;
    this.width = 0;
    this.height = 0;
}

var p = inherits(Stage, One);

p.testHit = function(point) {
    var x = point.x,
        y = point.y;
    if (x > 0 && x < this.width && y > 0 && y < this.height) {
        return true;
    }
    return false;
};

p.draw = function(context) {
    try {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, this.width, this.height);
    } catch (e) {}
};

module.exports = Stage;
