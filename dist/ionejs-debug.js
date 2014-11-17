define("phyxdown/ionejs/1.0.0/ionejs-debug", [ "./core/One-debug" ], function(require, exports, module) {
    var ionejs = {};
    ionejs.core = {};
    ionejs.core.one = require("./core/One-debug");
    module.exports = ionejs;
});

define("phyxdown/ionejs/1.0.0/core/One-debug", [], function(require, exports, module) {
    /**
	 * What is one? 
	 * I mean oberservable nested existing.
	 * eh..
	 * That is a pity.
	 */
    var One = function() {
        var listeners = {};
        listeners["bubble"] = {};
        listeners["capture"] = {};
        this._listeners = listeners;
    };
    var p = One.prototype;
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
    module.exports = One;
});
