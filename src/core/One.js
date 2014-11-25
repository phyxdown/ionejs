define(function(require, exports, module) {

    var Matrix2D = require('../geom/Matrix2D');
    var Point = require('../geom/Point');

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

        this.x = options.x;
        this.y = options.y;
        this.regX = options.regX;
        this.regY = options.regY;
        this.rotation = options.rotation;
        this.scaleX = options.scaleX;
        this.scaleY = options.scaleY;
        this.skewX = options.skewX;
        this.skewY = options.skewY;
        this.alpha = options.alpha;
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
            else if(map[name].length == 1) delete map[name];
            else {
                for(var i = 0, l = map[name].length; i < l; i++){
                    if(map[name][i] === one) map[name].splice(i, 1);
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
     * Name based query
     * @param  {string} path      eg. "pricess.leg.skin"
     * @param  {string} separator eg. "."
     * @return {core.One}
     */
    p.query = function(path, separator){
        try{
            var separator = separator || ".";
            var names = path.split(separator);
            var _query = function(one, names){
                if(names.length > 1){
                    return _query(one._childMap[names.shift()][0], names);
                }
                else
                    return one._childMap[names.shift()][0];
            }
            return _query(this, names) || null;
        }
        catch(e) {
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
        event.currentTarget = this;
        try {
            var phase = event.phase === Event.CAPTURING_PHASE ? "capture" : "bubble";
            var arr = this._listeners[phase][event.type].slice();
            for (i = 0, len = arr.length; i < len; i++) {
                arr[i](event);
                if (event._immediatePropagationStopped) break;
            }
        } catch (e) {}
    };

    p._getRelativeMatrix = function() {
        var matrix = new Matrix2D();
        return matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
    };

    p._getAbsoluteMatrix = function() {
        var ancestors = this.getAncestors();
        var matrix = new Matrix2D();
        matrix.identity();
        for (var i = ancestors.length - 1; i > -1; i--) {
            matrix.appendMatrix(ancestors[i]._getRelativeMatrix());
        }
        matrix.appendMatrix(this._getRelativeMatrix());
        return matrix;
    };

    /**
     * convert global coordinates to local
     * @param  {geom.Point} point 
     * @return {geom.Point} 
     */
    p.globalToLocal = function(point) {
        var am = this._getAbsoluteMatrix();
        am.invert().append(1, 0, 0, 1, point.x, point.y);
        return new Point(am.tx, am.ty);
    };

    /**
     * convert local coordinates to global
     * @param  {geom.Point} point 
     * @return {geom.Point} 
     */
    p.localToGlobal = function(point) {
        var am = this._getAbsoluteMatrix();
        am.append(1, 0, 0, 1, point.x, point.y);
        return new Point(am.tx, am.ty);
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
        this._visible && this.draw(context);
        context.save();
        var matrix = this._getRelativeMatrix();
        context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
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

    module.exports = One;
});