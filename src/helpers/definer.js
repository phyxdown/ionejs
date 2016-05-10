var Definer = function(){};

var p = Definer.prototype;

p.define = function(options){
	var superConstruct = options.superConsctruct || function() {};
	var fields = {};
	var methods = {};

	for (var i in options) {
		if (i == 'superConstruct')
			continue;
		else if (typeof options[i] == 'function') 
			methods[i] = options[i];
		else
			fields[i] = options[i];
	}

	var construct = function() {
		superConstruct.apply(this, arguments);
		var I = this;
		for (var i in fields) {
			I[i] = fields[i];
		}
	}
	construct._super = superConstruct;
	var p = construct.prototype = Object.create(superConstruct.prototype, {
		constructor: {
			value: construct,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
	for (var i in methods) {
		p[i] = methods[i];
	}
	return construct;
};

module.exports = new Definer();
