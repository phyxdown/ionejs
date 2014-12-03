define(function(require, exports, module) {

    var inherits = require('../../utils/inherits');
    var One = require('../One');

    var Cliper = function(options) {
        One.apply(this, arguments);
        this.width = options.width;
        this.height = options.height;
    };

    var p = inherits(Cliper, One);

    p.draw = function(context) {
        var width = this.width;
        var height = this.height;
        context.beginPath(); 
        context.rect(0,0,width,height);
        context.clip();
        context.closePath();
    };

    module.exports = Cliper;
});