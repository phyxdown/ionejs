var inherits = require('../../utils/inherits');
var One = require('../One');

var Writer = function(options) {
    One.apply(this, arguments);
    this.text = options.text || "text";
    this.prefix = options.prefix || "";
    this.align = options.align || "start";
    this.baseline = options.baseline  || "top";
    this.color = options.color || "#000000";
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
    context.textAlign = me.align;
    context.textBaseline = me.baseline;
    context.fillStyle = me.color;
    context.fillText(me.prefix + me.text || "", 0, 0);
};

module.exports = Writer;
