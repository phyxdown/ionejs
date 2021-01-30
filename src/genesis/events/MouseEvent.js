import { Event } from '../../core/Event.js';

export class MouseEvent extends Event {

	constructor(options) {
		super(options);
		var local = options.local.clone();
		var global = options.global.clone();
		this.x = local.x;
		this.y = local.y;
		this.local = local;
		this.global = global;
	}

	validate(options) {}
}
