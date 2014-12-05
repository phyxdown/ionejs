define(function(require, exports, module) {

    var Event = function(options) {

        this.type = options.type;

        this.target = null;

        this.currentTarget = null;

        this.phase = null;

        this._immediatePropagationStoped = false;
        this._propagationStoped = false;
    };

    Event.CAPTURING_PHASE = 1;
    Event.AT_TARGET = 2;
    Event.BUBBLING_PHASE = 3;

    var p = Event.prototype;

    p.isPropagationStopped = function() {
        return this._propagationStoped;
    };

    p.stopImmediatePropagation = function() {
        this._immediatePropagationStoped = true;
        this._propagationStoped = true;
    };

    p.stopPropagation = function() {
        this._propagationStoped = true;
    };

    module.exports = Event;

});