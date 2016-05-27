var inherits = require('../../utils/inherits');
var One = require('../One');

var Cliper = function(options) {
    One.apply(this, arguments);
    this._alias = 'ionejs.Cliper';
};

var p = inherits(Cliper, One);

p.draw = function(context) {
    var width = this.state.width;
    var height = this.state.height;
    var startX = this.state.startX;
    var startY = this.state.startY;
    context.beginPath(); 
    context.rect(startX,startY,width,height);
    context.clip();
    context.closePath();
};

module.exports = Cliper;
