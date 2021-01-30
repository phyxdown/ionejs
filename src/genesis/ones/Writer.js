import { register } from '../../helpers/index.js';
import { One, Action, Event } from '../../core/index.js';

export class Writer extends One {
	constructor(options) {
		super(options);
		options.text = options.text || "text";
		options.prefix = options.prefix || "";
		options.align = options.align || "start";
		options.baseline = options.baseline || "top";
		options.color = options.color || "#000000";
		options.font = options.font || "Bold 20px Arial";
	}

	draw(context) {
        var I = this, S = I.state;
        context.font = S.font;
        context.textAlign = S.align;
        context.textBaseline = S.baseline;
        context.fillStyle = S.color;
        context.fillText(S.prefix + S.text, 0, 0);
    }
}

register.Actions["Writer"] = Writer;
