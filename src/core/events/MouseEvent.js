define(function(require, exports, module) {
    var inherits = require('../../utils/inherits');
    var Event = require('../Event');

    var lx = 0;
    var ly = 0;

    var MouseEvent = function(options) {
        Event.apply(this, arguments);
        var local = options.local.clone();
        var global = options.global.clone();
        this.x = local.x;
        this.y = local.y;
    	this.dx = global.x - lx;
    	this.dy = global.y - ly;
        lx = global.x;
        ly = global.y;
        this.local = local;
        this.global = global;
    };

    MouseEvent.validate = function(options){};

    var p = inherits(MouseEvent, Event);

    module.exports = MouseEvent;

});