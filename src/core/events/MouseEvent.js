define(function(require, exports, module) {
	var inherits = require('../../utils/inherits');
	var Event = require('../Event');

	var MouseEvent = function(options) {
		Event.apply(this, arguments);
		this.local = options.local;
		this.global = options.global;
	}

	var p = inherits(MouseEvent, Event);

	module.exports = MouseEvent;

});