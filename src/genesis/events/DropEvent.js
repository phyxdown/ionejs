import { Event } from '../../core/Event.js';

export class DropEvent extends Event {

	constructor(options) {
		super(options);
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
	}

	validate(options) {}
}

/**
 * Event type, static string
 * @type {string} DROP
 */
DropEvent.DROP = 'drop';
