var inherits = require('../../utils/inherits');
var Event = require('../../core/Event');

var MouseEvent = function(options) {
    Event.apply(this, arguments);
    var local = options.local.clone();
    var global = options.global.clone();
    this.x = local.x;
    this.y = local.y;
    this.local = local;
    this.global = global;
};

MouseEvent.validate = function(options){};

var p = inherits(MouseEvent, Event);

module.exports = MouseEvent;
