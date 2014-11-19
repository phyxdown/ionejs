define("phyxdown/ionejs/1.0.0/ionejs-debug", [ "./core/One-debug", "./geom/Matrix2D-debug", "./geom/Point-debug", "./core/Event-debug" ], function(require, exports, module) {
    var ionejs = {};
    ionejs.core = {};
    ionejs.core.One = require("./core/One-debug");
    ionejs.core.Event = require("./core/Event-debug");
    module.exports = ionejs;
});

define("phyxdown/ionejs/1.0.0/core/One-debug", [ "phyxdown/ionejs/1.0.0/geom/Matrix2D-debug", "phyxdown/ionejs/1.0.0/geom/Point-debug" ], function(require, exports, module) {
    var Matrix2D = require("phyxdown/ionejs/1.0.0/geom/Matrix2D-debug");
    var Point = require("phyxdown/ionejs/1.0.0/geom/Point-debug");
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
        this._active = true;
        this._visible = true;
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
	 * Get ancestors.
	 * Please read source code if you don't understand what is ancestors.
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
    p._globalToLocal = function(point) {
        var am = this._getAbsoluteMatrix();
        am.invert().append(1, 0, 0, 1, point.x, point.y);
        return new Point(am.tx, am.ty);
    };
    p._localToGlobal = function(point) {
        var am = this._getAbsoluteMatrix();
        am.append(1, 0, 0, 1, point.x, point.y);
        return new Point(am.tx, am.ty);
    };
    /**
     * Get one from descendants that seems to intersect the local coordinates,
     * which means this one is rendered over other intersected ones.
     * Please read source code if you don't understand what is descendants.
	 * It's not long.
     * @param  {geom.Point} point
     * @return {core.Object}
     */
    p.hit = function(point) {
        var children = this._children;
        for (var i = children.length - 1; i > -1; i--) {
            if (children[i].hit(point)) return;
        }
        if (this._hitable) {
            if (this.testHit(this._globalToLocal(point))) return this;
        }
        return null;
    };
    p.testHit = function(point) {
        console.log("#point#", point);
        return false;
    };
    module.exports = One;
});

/*
* Matrix2D
* Modified by phyxdown to fit CMD.
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/
define("phyxdown/ionejs/1.0.0/geom/Matrix2D-debug", [], function(require, exports, module) {
    // constructor:
    /**
	 * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrixes.
	 * @class Matrix2D
	 * @param {Number} [a=1] Specifies the a property for the new matrix.
	 * @param {Number} [b=0] Specifies the b property for the new matrix.
	 * @param {Number} [c=0] Specifies the c property for the new matrix.
	 * @param {Number} [d=1] Specifies the d property for the new matrix.
	 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
	 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
	 * @constructor
	 **/
    function Matrix2D(a, b, c, d, tx, ty) {
        this.setValues(a, b, c, d, tx, ty);
    }
    var p = Matrix2D.prototype;
    // constants:
    /**
	 * Multiplier for converting degrees to radians. Used internally by Matrix2D.
	 * @property DEG_TO_RAD
	 * @static
	 * @final
	 * @type Number
	 * @readonly
	 **/
    Matrix2D.DEG_TO_RAD = Math.PI / 180;
    // static public properties:
    /**
	 * An identity matrix, representing a null transformation.
	 * @property identity
	 * @static
	 * @type Matrix2D
	 * @readonly
	 **/
    Matrix2D.identity = null;
    // set at bottom of class definition.
    // public methods:
    /**
	 * Sets the specified values on this instance. 
	 * @method setValues
	 * @param {Number} [a=1] Specifies the a property for the new matrix.
	 * @param {Number} [b=0] Specifies the b property for the new matrix.
	 * @param {Number} [c=0] Specifies the c property for the new matrix.
	 * @param {Number} [d=1] Specifies the d property for the new matrix.
	 * @param {Number} [tx=0] Specifies the tx property for the new matrix.
	 * @param {Number} [ty=0] Specifies the ty property for the new matrix.
	 * @return {Matrix2D} This instance. Useful for chaining method calls.
	*/
    p.setValues = function(a, b, c, d, tx, ty) {
        // don't forget to update docs in the constructor if these change:
        this.a = a == null ? 1 : a;
        this.b = b || 0;
        this.c = c || 0;
        this.d = d == null ? 1 : d;
        this.tx = tx || 0;
        this.ty = ty || 0;
        return this;
    };
    /**
	 * Appends the specified matrix properties to this matrix. All parameters are required.
	 * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
	 * @method append
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.append = function(a, b, c, d, tx, ty) {
        var tx1 = this.tx;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
            var a1 = this.a;
            var c1 = this.c;
            this.a = a1 * a + this.b * c;
            this.b = a1 * b + this.b * d;
            this.c = c1 * a + this.d * c;
            this.d = c1 * b + this.d * d;
        }
        this.tx = tx1 * a + this.ty * c + tx;
        this.ty = tx1 * b + this.ty * d + ty;
        return this;
    };
    /**
	 * Prepends the specified matrix properties to this matrix.
	 * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
	 * All parameters are required.
	 * @method prepend
	 * @param {Number} a
	 * @param {Number} b
	 * @param {Number} c
	 * @param {Number} d
	 * @param {Number} tx
	 * @param {Number} ty
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.prepend = function(a, b, c, d, tx, ty) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        this.a = a * a1 + b * c1;
        this.b = a * b1 + b * d1;
        this.c = c * a1 + d * c1;
        this.d = c * b1 + d * d1;
        this.tx = tx * a1 + ty * c1 + this.tx;
        this.ty = tx * b1 + ty * d1 + this.ty;
        return this;
    };
    /**
	 * Appends the specified matrix to this matrix.
	 * This is the equivalent of multiplying `(this matrix) * (specified matrix)`.
	 * For example, you could calculate the combined transformation for a child object using:
	 * 	var o = myDisplayObject;
	 * 	var mtx = o.getMatrix();
	 * 	while (o = o.parent) {
	 * 		// append each parent's transformation in turn:
	 * 		o.appendMatrix(o.getMatrix());
	 * 	}
	 * @method appendMatrix
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.appendMatrix = function(matrix) {
        return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    };
    /**
	 * Prepends the specified matrix to this matrix.
	 * This is the equivalent of multiplying `(specified matrix) * (this matrix)`.
	 * @method prependMatrix
	 * @param {Matrix2D} matrix
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.prependMatrix = function(matrix) {
        return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    };
    /**
	 * Generates matrix properties from the specified display object transform properties, and appends them to this matrix.
	 * For example, you can use this to generate a matrix from a display object:
	 * 
	 * 	var mtx = new Matrix2D();
	 * 	mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @method appendTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation % 360) {
            var r = rotation * Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }
        if (regX || regY) {
            // append the registration offset:
            this.tx -= regX;
            this.ty -= regY;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single prepend operation?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        } else {
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        return this;
    };
    /**
	 * Generates matrix properties from the specified display object transform properties, and prepends them to this matrix.
	 * For example, you can use this to generate a matrix from a display object:
	 * 
	 * 	var mtx = new Matrix2D();
	 * 	mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
	 * @method prependTransform
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scaleX
	 * @param {Number} scaleY
	 * @param {Number} rotation
	 * @param {Number} skewX
	 * @param {Number} skewY
	 * @param {Number} regX Optional.
	 * @param {Number} regY Optional.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation % 360) {
            var r = rotation * Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single append?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        } else {
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        if (regX || regY) {
            // prepend the registration offset:
            this.tx -= regX * this.a + regY * this.c;
            this.ty -= regX * this.b + regY * this.d;
        }
        return this;
    };
    /**
	 * Applies a rotation transformation to the matrix.
	 * @method rotate
	 * @param {Number} angle The angle in radians. To use degrees, multiply by `Math.PI/180`.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.rotate = function(angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;
        this.a = a1 * cos - this.b * sin;
        this.b = a1 * sin + this.b * cos;
        this.c = c1 * cos - this.d * sin;
        this.d = c1 * sin + this.d * cos;
        this.tx = tx1 * cos - this.ty * sin;
        this.ty = tx1 * sin + this.ty * cos;
        return this;
    };
    /**
	 * Applies a skew transformation to the matrix.
	 * @method skew
	 * @param {Number} skewX The amount to skew horizontally in degrees.
	 * @param {Number} skewY The amount to skew vertically in degrees.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
    p.skew = function(skewX, skewY) {
        skewX = skewX * Matrix2D.DEG_TO_RAD;
        skewY = skewY * Matrix2D.DEG_TO_RAD;
        this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
        return this;
    };
    /**
	 * Applies a scale transformation to the matrix.
	 * @method scale
	 * @param {Number} x The amount to scale horizontally
	 * @param {Number} y The amount to scale vertically
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.scale = function(x, y) {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;
        return this;
    };
    /**
	 * Translates the matrix on the x and y axes.
	 * @method translate
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.translate = function(x, y) {
        this.tx += x;
        this.ty += y;
        return this;
    };
    /**
	 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
	 * @method identity
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.identity = function() {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this;
    };
    /**
	 * Inverts the matrix, causing it to perform the opposite transformation.
	 * @method invert
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	 **/
    p.invert = function() {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1 * d1 - b1 * c1;
        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = (c1 * this.ty - d1 * tx1) / n;
        this.ty = -(a1 * this.ty - b1 * tx1) / n;
        return this;
    };
    /**
	 * Returns true if the matrix is an identity matrix.
	 * @method isIdentity
	 * @return {Boolean}
	 **/
    p.isIdentity = function() {
        return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
    };
    /**
	 * Returns true if this matrix is equal to the specified matrix (all property values are equal).
	 * @method equals
	 * @param {Matrix2D} matrix The matrix to compare.
	 * @return {Boolean}
	 **/
    p.equals = function(matrix) {
        return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
    };
    /**
	 * Transforms a point according to this matrix.
	 * @method transformPoint
	 * @param {Number} x The x component of the point to transform.
	 * @param {Number} y The y component of the point to transform.
	 * @param {Point | Object} [pt] An object to copy the result into. If omitted a generic object with x/y properties will be returned.
	 * @return {Point} This matrix. Useful for chaining method calls.
	 **/
    p.transformPoint = function(x, y, pt) {
        pt = pt || {};
        pt.x = x * this.a + y * this.c + this.tx;
        pt.y = x * this.b + y * this.d + this.ty;
        return pt;
    };
    /**
	 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that these values
	 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
	 * results.
	 * @method decompose
	 * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
	 * @return {Object} The target, or a new generic object with the transform properties applied.
	*/
    p.decompose = function(target) {
        // TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation even when scale is negative
        if (target == null) {
            target = {};
        }
        target.x = this.tx;
        target.y = this.ty;
        target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
        var skewX = Math.atan2(-this.c, this.d);
        var skewY = Math.atan2(this.b, this.a);
        var delta = Math.abs(1 - skewX / skewY);
        if (delta < 1e-5) {
            // effectively identical, can use rotation:
            target.rotation = skewY / Matrix2D.DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0) {
                target.rotation += target.rotation <= 0 ? 180 : -180;
            }
            target.skewX = target.skewY = 0;
        } else {
            target.skewX = skewX / Matrix2D.DEG_TO_RAD;
            target.skewY = skewY / Matrix2D.DEG_TO_RAD;
        }
        return target;
    };
    /**
	 * Copies all properties from the specified matrix to this matrix.
	 * @method copy
	 * @param {Matrix2D} matrix The matrix to copy properties from.
	 * @return {Matrix2D} This matrix. Useful for chaining method calls.
	*/
    p.copy = function(matrix) {
        return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    };
    /**
	 * Returns a clone of the Matrix2D instance.
	 * @method clone
	 * @return {Matrix2D} a clone of the Matrix2D instance.
	 **/
    p.clone = function() {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    };
    /**
	 * Returns a string representation of this object.
	 * @method toString
	 * @return {String} a string representation of the instance.
	 **/
    p.toString = function() {
        return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]";
    };
    // this has to be populated after the class is defined:
    Matrix2D.identity = new Matrix2D();
    module.exports = Matrix2D;
});

define("phyxdown/ionejs/1.0.0/geom/Point-debug", [], function(require, exports, module) {
    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    };
    module.exports = Point;
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
