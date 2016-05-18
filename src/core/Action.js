var Action = function(one) {
    this.one = one;
};

var p = Action.prototype;

p.on = p.addEventListener = function(type, listener, useCapture) {
    this.one.addEventListener(type, listener, useCapture);
};

p.off = p.removeEventListener = function(type, listener, useCapture) {
    this.one.removeEventListener(type, listener, useCapture);
};

p.getGroup = function() {
    return this.one.getGroup();
};

p.afterCreate = function() {};
p.beforeMount = function() {};
p.afterMount = function() {};
p.beforeUnmount = function() {};
p.afterUnmount = function() {};

p.update = function() {};
module.exports = Action;
