define(function(require, exports, module) {
    /**
     * Undrawable context or mathematical context is expected.
     * This class should not be exposed.
     * But currently....
     */
    function Matrix2D(a, b, c, d, x, y) {
        this.setValues(a, b, c, d, x, y);
    }

    function ignorify(args, def){
        var defult = def||[];
        for(var i = 0, l = def.length; i < l; i++){
            if(typeof args[i] != "number") args[i] = def[i] || 0;
        }
        return args;
    }

    var p = Matrix2D.prototype;

    p.setValues = function(a, b, c, d, x, y) {
        ignorify(arguments, [1, 0, 0, 1, 0, 0]);

        var keys = ["a", "b", "c", "d", "x", "y"];
        var me = this;
        var args = arguments;
        keys.forEach(function(key, i){
            me[key] = args[i]
        });
        return this;
    };

    p.append = function(a, b, c, d, x, y) {
        ignorify(arguments, [1, 0, 0, 1, 0, 0]);

        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var x1 = this.x;
        var y1 = this.y;

        this.a = a1*a + c1*b;
        this.b = b1*a + d1*b;
        this.c = a1*c + c1*d;
        this.d = b1*c + d1*d;
        this.x = a1*x + c1*y + x1;
        this.y = b1*x + d1*y + y1;

        return this;
    };

    p.appendMatrix = function(matrix) {
        return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.x, matrix.y);
    };

    p.prepend = function(a, b, c, d, x, y){
        var pre = new Matrix2D(a, b, c, d, x, y);
        return this.copy(pre.appendMatrix(this));
    };

    p.prependMatrix = function(matrix) {
        return this.copy(matrix.appendMatrix(this));
    };

    p.identity = function() {
        this.a = this.d = 1;
        this.b = this.c = this.x = this.y = 0;
        return this;
    };

    p.invert = function() {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var x1 = this.x;
        var y1 = this.y;
        var n = a1*d1-b1*c1;

        this.a = d1/n;
        this.b = -b1/n;
        this.c = -c1/n;
        this.d = a1/n;
        this.x = (c1*y1-d1*x1)/n;
        this.y = (b1*x1-a1*y1)/n;
        return this;
    };

    p.transform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        ignorify(arguments, [ 0, 0, 1, 1, 0, 0, 0, 0, 0 ]);
        rotation *= Math.PI / 180;
        skewX *= Math.PI / 180;
        skewY *= Math.PI / 180;
        var cos = Math.cos, sin = Math.sin;
        this.prepend(1, 0, 0, 1, regX, regY);
        this.prepend(scaleX, 0, 0, scaleY, 0, 0);
        this.prepend(cos(rotation), sin(rotation), -sin(rotation), cos(rotation), 0, 0);
        this.prepend(1, 0, 0, 1, x, y);
        return this;
    };

    p.equals = function(matrix) {
        return this.x === matrix.x && this.y === matrix.y && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
    };

    p.copy = function(matrix){
        var keys = ["a", "b", "c", "d", "x", "y"];
        var me = this;
        keys.forEach(function(key){
            me[key] = matrix[key]
        });
        return this;
    };

    p.clone = function() {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    };

    module.exports = Matrix2D;
});