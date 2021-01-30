import { definer } from '../../helpers/index.js';

export var Writer = definer.defineOne({
    afterCreate: function(options) {
		options.text = options.text || "text";
		options.prefix = options.text || "";
		options.align = options.text || "start";
		options.baseline = options.text || "top";
		options.color = options.text || "#000000";
		options.font = options.text || "Bold 20px Arial";
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
