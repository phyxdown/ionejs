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
    this.state.mM = matrix;
};

p.mTsl = function(x, y){
    this.state.mX = x;
    this.state.mY = y;
};

p.mReset = function(){
    this.state.mM = this.getAbsoluteMatrix();
    this.state.mX = 0;
    this.state.mY = 0;
};

p.draw = function(context) {
    var me = this;
    var m = me.state.mM;
    var x = me.state.mX;
    var y = me.state.mY;
    context.save();
    context.translate(x, y);
    context.transform(m.a, m.b, m.c, m.d, m.x, m.y);

    if (me._origin)
        me._origin._draw(context);
    
    context.restore();
};

module.exports = Phantom;
