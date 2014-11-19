define(function(require, exports, module) {

	var Engine = require("./core/Engine");

	var ionejs = {};

	ionejs.instance = new Engine();
	ionejs.One = require("./core/One");
	ionejs.Stage = require("./core/Stage");
	ionejs.Event = require("./core/Event");

	module.exports = ionejs;

});