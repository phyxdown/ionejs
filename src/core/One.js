define(function(require, exports, module) {

    var Point = require('../geom/Point');
    var Matrix = require('./Matrix');
    var Event = require("./Event");

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

        /**
         * Duplicated names and anonymity are both permitted.
         * But this._name can't be changed after this is constructed.
         * Basically, no properties with _ prefixed can be accessed directly.
         * @option {string} name
         */
        this._name = options.name || null;

        this._parent = null;
        this._childMap = {};
        this._children = [];

        //Docs expected
        this._active = true;
        //Docs expected
        this._visible = true;
        //Docs expected
        this._hitable = false;
        //Docs expected
        this._moveable = false;
        //Docs expected
        this._dropable = false;

        this.x = options.x || 0;
        this.y = options.y || 0;
        this.regX = options.regX || 0;
        this.regY = options.regY || 0;
        this.rotation = options.rotation || 0;
        this.scaleX = options.scaleX == 0 ? 0 : options.scaleX || 1;
        this.scaleY = options.scaleY == 0 ? 0 : options.scaleY || 1;
        this.skewX = options.skewX || 0;
        this.skewY = options.skewY || 0;
        this.alpha = options.alpha == 0 ? 0 : options.alpha || 1;
    };

    var p = One.prototype;

    p._mapChild = function(one) {
        if (one._name) {
            var name = one._name;
            var map = this._childMap;
            if (!map[name]) {
                map[name] = [one];
            } else {
                map[name].unshift(one);
            }
        }
    };

    p._unmapChild = function(one) {
        if (one._name) {
            var name = one._name;
            var map = this._childMap;
            if (!map[name]) return;
            else if (map[name].length == 1) delete map[name];
            else {
                for (var i = 0, l = map[name].length; i < l; i++) {
                    if (map[name][i] === one) map[name].splice(i, 1);
                }
            }
        }
    };

    /**
     * Add one at the end of the child list(_children), as the tail or the top.
     * In rendering phase, the tail of the child list will be rendered over any other ones in same list.
     * @param {core.One} one
     */
    p.addChild = function(one) {
        one.setParent(this);
        this._children.push(one);
        this._mapChild(one);
    };

    /**
     * Insert one into the child list(_children) according to the index.
     * If index exceeds the length of the child list, one will be added as the tail.
     * @param  {core.One} one
     * @param  {number} index
     */
    p.insertChild = function(one, index) {
        one.setParent(this);
        this._children.splice(index, 0, one);
        this._mapChild(one);
    };

    /**
     * Remove one from the child list(_children)
     * If the one is not in the child list, removing will not make sense.
     * As this process needs iteration, meaningless removing causes considerable performance demerit.
     * @param  {core.One} one
     */
    p.removeChild = function(one) {
        var children = this._children;
        for (var i = 0, l = children.length; i < l; i++) {
            if (children[i] === one) {
                one.setParent(null);
                children.splice(i, 1);
                this._unmapChild(one);
            }
        }
    };

    /**
     * Get children.
     * @return {Array} children
     */
    p.getChildren = function() {
        return this._children;
    };

    /**
     * Name based query
     * @param  {string} path      eg. "pricess.leg.skin"
     * @param  {string} separator eg. "."
     * @return {core.One}
     */
    p.query = function(path, separator) {
        try {
            var separator = separator || ".";
            var names = path.split(separator);
            var _query = function(one, names) {
                if (names.length > 1) {
                    return _query(one._childMap[names.shift()][0], names);
                } else
                    return one._childMap[names.shift()][0];
            }
            return _query(this, names) || null;
        } catch (e) {
            return null;
        }
    };

    /**
     * Get parent.
     * @return {core.One} parent
     */
    p.getParent = function() {
        return this._parent;
    };

    /**
     * Set parent.
     * @param {core.One} parent
     */
    p.setParent = function(one) {
        this._parent = one;
    };

    /**
     * Get stage.
     * The methed assumes that stage is the root of display hierachy.
     * @return {one.Stage}
     */
    p.getStage = function() {
        var arr = [];
        var cur = this;
        while (cur._parent) {
            cur = cur._parent;
        }
        return cur;
    };

    /**
     * Get ancestors.
     * Please read source code if you don't understand what ancestors are.
     * It's not long.
     * @return {Array}
     */
    p.getAncestors = function() {
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
            if (arr[i] === listener)
                return;
        }
        if (!arr)
            this._listeners[phase][type] = [listener];
        else
            arr.push(listener);
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
            if (arr[i] === listener) {
                if (l == 1)
                    delete(this._listeners[phase][type]);
                else
                    arr.splice(i, 1);
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
        event.target = this;

        var arr = this.getAncestors();

        event.phase = Event.CAPTURING_PHASE;
        for (var i = arr.length - 1; i >= 0; i--) {
            arr[i]._dispatchEvent(event);
            if (event._propagationStopped) return;
        }

        event.phase = Event.AT_TARGET;
        this._dispatchEvent(event);
        if (event._propagationStopped) return;

        event.phase = Event.BUBBLING_PHASE;
        for (var i = 0, len = arr.length; i < len; i++) {
            arr[i]._dispatchEvent(event);
            if (event._propagationStopped) return;
        }
    };

    p._dispatchEvent = function(event) {
        event.currentTarget = this;
        var phase, arr;
        /**
         * The code below is ambiguous, explicit logic may be expected.
         */
        try {
            phase = event.phase === Event.CAPTURING_PHASE ? "capture" : "bubble";
            arr = this._listeners[phase][event.type].slice();
        } catch (e) {
            return;
        }

        for (var i = 0, len = arr.length; i < len; i++) {
            try {
                arr[i](event);
                if (event._immediatePropagationStopped) break;
            } catch (e) {
                console.log(e, arr[i]);
            }
        }

    };

    p.overlay = function(one, keys){
        var keys = keys || ["x", "y", "scaleX", "scaleY", "rotation", "skewX", "skewY", "regX", "regY", "alpha"];
        var me = this;
        keys.forEach(function(key, i){
            me[key] = one[key];
        });
    };

    p.getAbsoluteMatrix = function() {
        var ancestors = this.getAncestors();
        var m = new Matrix();
        for (var i = ancestors.length - 1; i > -1; i--) {
            m.transform(ancestors[i]);
        }
        return m.transform(this);
    };

    /**
     * convert global coordinates to local
     * @param  {geom.Point} point
     * @return {geom.Point}
     */
    p.globalToLocal = function(point) {
        return point.clone().retransform(this.getAbsoluteMatrix());
    };

    /**
     * convert local coordinates to global
     * @param  {geom.Point} point
     * @return {geom.Point}
     */
    p.localToGlobal = function(point) {
        return point.clone().transform(this.getAbsoluteMatrix());
    };

    /**
     * Get one from descendants that seems to intersect the local coordinates,
     * which means this one is rendered over other intersected ones.
     * Please read source code if you don't understand what descendants are.
     * It's not long.
     * @param  {geom.Point} point
     * @return {core.Object}
     */
    p.hit = function(point) {
        var children = this._children;
        for (var i = children.length - 1; i > -1; i--) {
            var descendant = children[i].hit(point);
            if (descendant) return descendant;
        }
        if (this._hitable) {
            if (this.testHit(this.globalToLocal(point))) return this;
        }
        return null;
    };

    /**
     * testHit is useful when overrided, to test whether this one intersects the hit point.
     * When _hitable is set to false, testHit does not work.
     * @param  {geom.Point} point
     * @return {boolean}
     */
    p.testHit = function(point) {
        return false;
    };


    p._draw = function(context) {
        context.save();
        var am = new Matrix(this);
        context.transform(am.a, am.b, am.c, am.d, am.x, am.y);
        context.globalAlpha *= this.alpha;
        if (this._visible) {
            try {
                this.draw(context);
            } catch (e) {
                console.log(e, this)
            }
        }
        for (var i = 0, l = this._children.length; i < l; i++) {
            var child = this._children[i];
            child._draw(context);
        }
        context.restore();
    };

    /**
     * Abstract method
     * Override it to draw something.
     * @param  {Context} context This context is defined as local.
     */
    p.draw = function(context) {};

    p._update = function() {
        if (this._active) {
            try {
                this.update();
            } catch (e) {
                console.log(e, this)
            }
        }
        for (var i = 0, l = this._children.length; i < l; i++) {
            var child = this._children[i];
            child._update();
        }
    };

    /**
     * Abstract method
     * Override it to update something.
     */
    p.update = function() {};

    /**
     * swtich mode of One
     * @param  {string} mode
     * @return {core.One} this
     */
    p.mode = function(mode) {
        switch (mode) {
            case "hitable" :
                this._hitable = true;
                this._moveable = false;
                this._dropable = false;
                break;
            case "moveable":
                this._hitable = true;
                this._moveable = true;
                this._dropable = false;
                break;
            case "dropable":
                this._hitable = true;
                this._moveable = false;
                this._dropable = true;
                break;
            default:
                break;
        }
        return this;
    };

    module.exports = One;
});