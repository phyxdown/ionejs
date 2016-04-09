var inherits = require('../../utils/inherits');
var One = require('../One');

var Cliper = function(options) {
    One.apply(this, arguments);
};

var p = inherits(Cliper, One);

p.draw = function(context) {
    var width = this._state.width;
    var height = this._state.height;
    var startX = this._state.startX;
    var startY = this._state.startY;
    context.beginPath(); 
    context.rect(startX,startY,width,height);
    context.clip();
    context.closePath();
};

module.exports = Cliper;
