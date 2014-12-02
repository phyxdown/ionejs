define(function(require, exports, module) {

    var inherits = require('../../utils/inherits');
    var One = require('../One');

    var Phantom = function(options) {
        One.apply(this, arguments);
    };

    var p = inherits(Phantom, One);

    p.set = function(one) {
        if (one instanceof One || one == null) {
            this._origin = one;
            one && this.overlay(one.getParent(), 
                ["x", "y", "scaleX", "scaleX", "rotation", "skewX", "skewY", "regX", "regY"]);
        } else {
            console.log("#phantom.set#", "illegal params.");
        }
    };

    p.draw = function(context) {
        var me = this;
        if (me._origin)
            me._origin._draw(context);
    };

    module.exports = Phantom;
});