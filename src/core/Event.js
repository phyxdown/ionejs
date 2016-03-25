var Event = function(options) {

    this.type = options.type;

    this.target = null;

    this.currentTarget = null;

    this.phase = null;

    this._immediatePropagationStopped = false;
    this._propagationStopped = false;
};

Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

var p = Event.prototype;

p.isPropagationStopped = function() {
    return this._propagationStopped;
};

p.stopImmediatePropagation = function() {
    this._immediatePropagationStopped = true;
    this._propagationStopped = true;
};

p.stopPropagation = function() {
    this._propagationStopped = true;
};

module.exports = Event;
