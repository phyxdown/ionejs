define(function(require, exports, module) {
    exports.getTester = function(x, y, width, height) {
        return function(point) {
            return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
        }
    }
});