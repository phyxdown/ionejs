define(function(require, exports, module) {

    function Matrix2D(a, b, c, d, x, y) {
        this.setValues(a, b, c, d, x, y);
    }

    function ignorify(args, def){
        var defult = def||[];
        for(var i = 0, l = args.length; i < l; i++){
            if(typeof args[i] != "number") args[i] = def[i] || 0;
        }
        return args;
    }

    var p = Matrix2D.prototype;

    p.setValues = function(a, b, c, d, x, y) {
        if(arguments.length < 6) return;
        ignorify(arguments, [1, 0, 0, 1, 0, 0]);

        var keys = ["a", "b", "c", "d", "x", "y"];
        keys.forEach(function(key, i){
            this[key] = arguments[i]
        });
        return this;
    };

    p.append = function(a, b, c, d, x, y) {
        if(arguments.length < 6) return;
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

    p.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        ignorify(arguments, [0, 0, 1, 1, 0, 0, 0, 0, 0]);
        rotation *= Math.PI / 180;
        skewX *= Math.PI / 180;
        skewY *= Math.PI / 180;
        this.x -= regX;
        this.y -= regY;
        this.append(Math.cos(rotation) * scaleX, Math.sin(rotation) * scaleX, -Math.sin(rotation) * scaleY, Math.cos(rotation) * scaleY, 0, 0);
        this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        return this;
    };

    p.identity = function() {
        this.a = this.d = 1;
        this.b = this.c = this.x = this.y = 0;
        return this;
    };
    /**
     * doubtful
     */
    p.invert = function() {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var x1 = this.x;
        var n = a1 * d1 - b1 * c1;

        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.x = (c1 * this.y - d1 * x1) / n;
        this.y = (a1 * this.y - b1 * x1) / n;
        return this;
    };

    p.equals = function(matrix) {
        return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
    };

    p.clone = function() {
        return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
    };

    Matrix2D.identity = new Matrix2D();

    module.exports = Matrix2D;
});