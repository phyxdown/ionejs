import { definer } from '../../helpers/index.js';
import _ from 'underscore';

export var Writer = definer.defineOne({
    afterCreate: function(options) {
        _.defaults(options, {
            text: "text",
            prefix: "",
            align: "start",
            baseline: "top",
            color: "#000000",
            font: "Bold 20px Arial"
        });
    },
    draw: function(context) {
        var I = this, S = I.state;
        context.font = S.font;
        context.textAlign = S.align;
        context.textBaseline = S.baseline;
        context.fillStyle = S.color;
        context.fillText(S.prefix + S.text, 0, 0);
    }
}, 'Writer');
