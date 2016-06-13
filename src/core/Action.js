var Action = function(one) {
    this.one = one;
};

var p = Action.prototype;

p.afterCreate = function() {};
p.beforeMount = function() {};
p.afterMount = function() {};
p.beforeUnmount = function() {};
p.afterUnmount = function() {};

p.update = function() {};
module.exports = Action;
