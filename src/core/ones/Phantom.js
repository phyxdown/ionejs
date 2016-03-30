var inherits = require('../../utils/inherits');
var One = require('../One');

var Phantom = function(options) {
    One.apply(this, arguments);

    this.mReset();
};

var p = inherits(Phantom, One);

p.set = function(one) {
    if (one instanceof One || one == null) {
        this._origin = one;
    } else {
        console.log("#phantom.set#", "illegal params.");
    }
};

p.mTrz = function(matrix){
    this._state.mM = matrix;
};

p.mTsl = function(x, y){
    this._state.mX = x;
    this._state.mY = y;
};

p.mReset = function(){
    this._state.mM = this.getAbsoluteMatrix();
    this._state.mX = 0;
    this._state.mY = 0;
};

p.draw = function(context) {
    var me = this;
    var m = me._state.mM;
    var x = me._state.mX;
    var y = me._state.mY;
    context.save();
    context.translate(x, y);
    context.transform(m.a, m.b, m.c, m.d, m.x, m.y);

    if (me._origin)
        me._origin._draw(context);
    
    context.restore();
};

module.exports = Phantom;
