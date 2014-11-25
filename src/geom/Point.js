define(function(require, exports, module) {
    var Point = function(x, y) {
        this.x = x;
        this.y = y;
    }

    var p = Point.prototype;

    p.distance = function(point){
    	var dx = point.x - this.x;
    	var dy = point.y - this.y;
    	return Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
    }

    module.exports = Point;
});