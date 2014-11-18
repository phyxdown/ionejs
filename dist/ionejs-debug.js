define("phyxdown/ionejs/1.0.0/ionejs-debug", [ "./core/One-debug", "./core/Event-debug" ], function(require, exports, module) {
    var ionejs = {};
    ionejs.core = {};
    ionejs.core.One = require("./core/One-debug");
    ionejs.core.Event = require("./core/Event-debug");
    module.exports = ionejs;
});

define("phyxdown/ionejs/1.0.0/core/One-debug", [], function(require, exports, module) {
    /**
	 * What is one? 
	 * I mean oberservable nested existing.
	 * eh..
	 * That is a pity.
	 */
    var One = function(options) {
        /**
		 * Param check is expected.
		 * The code line below is temporary.
		 */
        options = options || {};
        var listeners = {};
        listeners["bubble"] = {};
        listeners["capture"] = {};
        this._listeners = listeners;
        this._parent = options.parent || null;
        this._children = [];
    };
    var p = One.prototype;
    /**
	 * Add one at the end of the child list, as the tail or the top.
	 * In rendering phase, the tail of the child list will be rendered over any other ones in same list.
	 * @param {core.One} one
	 */
    p.addChild = function(one) {
        one.setParent(this);
        this._children.push(one);
    };
    /**
	 * Insert one into the child list according to the index.
	 * If index exceeds the length of the child list, one will be added as the tail.
	 * @param  {core.One} one
	 * @param  {number} index
	 */
    p.insertChild = function(one, index) {
        one.setParent(this);
        this._children.splice(index, 0, one);
    };
    /**
	 * Remove one from the child list.
	 * If the one is not in the child list, removing will not make sense.
	 * As no cache nor map is applied, meaningless removing causes considerable performance demerit.
	 * @param  {core.One} one
	 */
    p.removeChild = function(one) {
        var children = this._children;
        for (var i = 0, l = children.length; i < l; i++) {
            if (children[i] == one) {
                one.setParent(null);
                children.splice(i, 1);
            }
        }
    };
    /**
	 * Set parent.
	 * @param {one.Core} one
	 */
    p.setParent = function(one) {
        this._parent = one;
    };
    /**
	 * Get ancients.
	 * Please read source code if you don't understand what is ancients.
	 * It's not long.
	 * @return {Array}
	 */
    p.getAncients = function() {
        var arr = [];
        var cur = this;
        while (cur._parent) {
            cur = cur._parent;
            arr.push(cur);
        }
        return arr;
    };
    /**
	 * Add event listener.
	 * Duplicated adding would be ignored.
	 * @param {string} type
	 * @param {function} listener
	 * @param {boolean} useCapture
	 * @return {function} listener
	 */
    p.addEventListener = function(type, listener, useCapture) {
        var phase = useCapture ? "capture" : "bubble";
        var arr = this._listeners[phase][type];
        for (var i = 0, l = arr ? arr.length : 0; i < l; i++) {
            if (arr[i] == listener) return;
        }
        if (!arr) this._listeners[phase][type] = [ listener ]; else arr.push(listener);
        return listener;
    };
    /**
	 * Remove event listener.
	 * @param  {string} type
	 * @param  {function} listener
	 * @param  {boolean} useCapture
	 */
    p.removeEventListener = function(type, listener, useCapture) {
        var phase = useCapture ? "capture" : "bubble";
        var arr = this._listeners[phase][type];
        for (var i = 0, l = arr ? arr.length : 0; i < l; i++) {
            if (arr[i] == listener) {
                if (l == 1) delete this._listeners[phase][type]; else arr.splice(i, 1);
                break;
            }
        }
    };
    /**
	 * Fire event.
	 * Event dispatching in ionejs has three phases, which is similar to DOM.
	 * Capture --> Target --> Bubble
	 * See {core.Event} for more information.
	 * @param  {core.Event} event
	 */
    p.dispatchEvent = function(event) {
        event.origin = this;
        var arr = this.getAncients();
        event.phase = Event.CAPTURING_PHASE;
        for (var i = arr.length - 1; i >= 0; i--) {
            arr[i]._dispatchEvent(event);
            if (event._propagationStopped) return;
        }
        event.phase = Event.TARGET_PHASE;
        this._dispatchEvent(event);
        if (event._propagationStopped) return;
        event.phase = Event.BUBBLING_PHASE;
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i]._dispatchEvent(event);
            if (event._propagationStopped) return;
        }
    };
    p._dispatchEvent = function(event) {
        event.current = this;
        try {
            var phase = event.phase === Event.CAPTURING_PHASE ? "capture" : "bubble";
            var arr = this._listeners[phase][event.type].slice();
            for (i = 0, len = arr.length; i < len; i++) {
                arr[i](event);
                if (event._immediatePropagationStopped) break;
            }
        } catch (e) {
            console.log("#ionejs#", e);
        }
    };
    module.exports = One;
});

define("phyxdown/ionejs/1.0.0/core/Event-debug", [], function(require, exports, module) {
    var Event = function(options) {
        this.type = options.type;
        this.origin = null;
        this.current = null;
        this.phase = null;
        this._immediatePropagationStoped = false;
        this._propagationStoped = false;
    };
    Event.CAPTURING_PHASE = 1;
    Event.BUBBLING_PHASE = 2;
    Event.TARGET_PHASE = 3;
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
