var inherits = require('../../utils/inherits');
var Event = require('../Event');

var DropEvent = function(options) {
    Event.apply(this, arguments);
    var local = options.local.clone();
    var global = options.global.clone();

    /**
     * local x
     * @type {number}
     */
    this.x = local.x;

    /**
     * local x
     * @type {number}
     */
    this.y = local.y;

    /**
     * local coordinates, value type
     * @type {core.Point} local
     */
    this.local = local;

    /**
     * global coordinates, value type
     * @type {core.Point} global
     */
    this.global = global;

    /**
     * drop source, reference type
     * @type {core.One} dropSource
     */
    this.dropSource = options.dropSource;
};

/**
 * Event type, static string
 * @type {string} DROP
 */
DropEvent.DROP = 'drop';

DropEvent.validate = function(options){};

var p = inherits(DropEvent, Event);

module.exports = DropEvent;
