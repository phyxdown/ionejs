var inherits = require('../../utils/inherits');
var One = require('../One');

var Cliper = function(options) {
    One.apply(this, arguments);
    this._alias = 'ionejs.Cliper';
};

var p = inherits(Cliper, One);

p.draw = function(context) {
    var I = this, S = I.state;
    context.beginPath(); 
    context.rect(S.startX, S.startY, S.width, S.height);
    context.clip();
    context.closePath();
};

module.exports = Cliper;
