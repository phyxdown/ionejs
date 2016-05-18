var inherits = require('../../utils/inherits');
var One = require('../One');
var Engine = require('../actions/Engine');
var _ = require('underscore');

var Stage = function(idOrConf) {
    One.apply(this, [{hitable: true, group: 'app'}]);
    if (typeof idOrConf == 'string') this.id = idOrConf;
    else this.id = idOrConf.id;
    this.addAction(Engine);
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
