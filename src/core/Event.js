class Event {
	constructor(options) {
		var { type, ...data} = options.type;
		this.type = type;
		this.data = data;

		this.target = null;
		this.currentTarget = null;

		this.phase = null;

    	this._immediatePropagationStopped = false;
    	this._propagationStopped = false;
	}

	isPropagationStopped() {
    	return this._propagationStopped;
	}

	stopImmediatePropagation() {
    	this._immediatePropagationStopped = true;
    	this._propagationStopped = true;
	}

	stopPropagation() {
    	this._propagationStopped = true;
	}
}

Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

export { Event }
