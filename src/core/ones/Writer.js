define(function(require, exports, module) {

    var inherits = require('../../utils/inherits');
    var One = require('../One');

    var Writer = function(options) {
        One.apply(this, arguments);
        this.text = "text";
        this.prefix = "";
        this.align = options.align;
        this.baseline = options.baseline;
        this.color = options.color;
    };

    var p = inherits(Writer, One);

    /**
     * @param {string} text
     */

    /**
     * concert context.textAlign
     * @param {string} align
     */

    /**
     * concert context.textBaseline
     * @param {string} baseline
     */

    /**
     * concert context.fillStyle
     * @param {string} style
     */

    p.draw = function(context) {
        var me = this;
        context.font = me.font || "Bold 20px Arial";
        context.textAlign = me.align || "start";
        context.textBaseline = me.baseline || "top";
        context.fillStyle = me.color || "#000000";
        context.fillText(me.prefix + me.text || "", 0, 0);
    };

    module.exports = Writer;
});