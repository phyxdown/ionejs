var inherits = require('../../utils/inherits');
var One = require('../One');

var Phantom = function(options) {
    One.apply(this, arguments);
    this._alias = 'ionejs.Phantom';
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
    this.mM = matrix;
};

p.mTsl = function(x, y){
    this.mX = x;
    this.mY = y;
};

p.mReset = function(){
    this.mM = this.getAbsoluteMatrix();
    this.mX = 0;
    this.mY = 0;
};

p.draw = function(context) {
    var m = this.mM;
    var x = this.mX;
    var y = this.mY;
    context.save();
    context.translate(x, y);
    context.transform(m.a, m.b, m.c, m.d, m.x, m.y);

    if (this._origin)
        this._origin._draw(context);
    
    context.restore();
};

module.exports = Phantom;
