import _ from 'underscore';

class Event {
	constructor(options) {
		this.type = options.type;
		this.data = _.omit(options, 'type');

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
