var inherits = require('../../utils/inherits');
var One = require('../One');
var Engine = require('../Engine');
var _ = require('underscore');

var Stage = function(id) {
    One.apply(this, [{hitable: true}]);
    if (typeof id == 'string')
    	Engine.create(this, id);
}

var p = inherits(Stage, One);

p.testHit = function(point) {
    var state = this.state;
    var x = point.x,
        y = point.y;
    if (x > 0 && x < state.width && y > 0 && y < state.height) {
        return true;
    }
    return false;
};

p.draw = function(context) {
    var state = this.state;
    try {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, state.width, state.height);
    } catch (e) {}
};

module.exports = Stage;
