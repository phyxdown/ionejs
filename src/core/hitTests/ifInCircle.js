define(function(require, exports, module) {
    exports.getTester = function(center, radius) {
        return function(point) {
            return point.distance(center) <= radius;
        }
    }
});