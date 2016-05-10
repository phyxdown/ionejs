var inherits = require('../../utils/inherits');
var One = require('../One');
var _ = require('underscore');

var Writer = function(options) {
    _.defaults(options, {
        text: "text",
        prefix: "",
        align: "start",
        baseline: "top",
        color: "#000000",
        font: "Bold 20px Arial"
    });
    One.apply(this, arguments);
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
    var state = this.state;
    context.font = state.font;
    context.textAlign = state.align;
    context.textBaseline = state.baseline;
    context.fillStyle = state.color;
    context.fillText(state.prefix + state.text, 0, 0);
};

module.exports = Writer;
