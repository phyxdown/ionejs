var Matrix2D = require("../geom/Matrix2D");
var Point = require("../geom/Point");
var inherits = require("../utils/inherits")

var Matrix = function() {
    if (arguments.length == 6) {
        Matrix2D.apply(this, arguments);
    } else if (arguments.length == 1) {
        Matrix2D.apply(this, []);
        this.transform(arguments[0]);
    } else if (arguments.length == 0) {
        Matrix2D.apply(this, []);
    } else
        throw new Error("Illegal params for core.Matrix.");
}

var p = inherits(Matrix, Matrix2D);

p.transform = function(one) {
    var x = one.x,
        y = one.y,
        scaleX = one.scaleX,
        scaleY = one.scaleY,
        rotation = one.rotation,
        skewX = one.skewX,
        skewY = one.skewY,
        regX = one.regX,
        regY = one.regY;

    rotation *= Math.PI / 180;
    skewX *= Math.PI / 180;
    skewY *= Math.PI / 180;
    var cos = Math.cos,
        sin = Math.sin;
    this.prepend(1, 0, 0, 1, regX, regY);
    this.prepend(scaleX, 0, 0, scaleY, 0, 0);
    this.prepend(cos(rotation), sin(rotation), -sin(rotation), cos(rotation), 0, 0);
    this.prepend(cos(skewY), sin(skewY), -sin(skewX), cos(skewX), 0, 0);
    this.prepend(1, 0, 0, 1, x, y);
    return this;
}

p.translate = function() {};

p.rotate = function() {};

p.skew = function() {};

p.scale = function() {};

module.exports = Matrix;
