define(function(require, exports, module){

	var inherits = require('../utils/inherits');
	var One = require('./One');

    var Stage = function(options){
    	options.parent = null;
    	One.apply(this, arguments);

    	this.width = options.width;
    	this.height = options.height;
    }

    var p = inherits(Stage, One);

    module.exports = Stage;
});