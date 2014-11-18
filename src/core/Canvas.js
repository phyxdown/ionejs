define(function(require, exports, module){

	var inherits = require('../utils/inherits');
	var One = require('./One');

	var Canvas = function(options){
		this._canvas = document.createElement('canvas');
		canvas.width = options.width;
		canvas.height = options.height;
	}

	var p = Canvas.prototype;

	/**
	 * Init canvas by stage.
	 * @param  {core.Stage} stage
	 */
	p.init = function(stage){

	};
});