var Creator = function(){
	this._genesis = {};
};

var p = Creator.prototype;

p.set = function(alias, constructor){
	this._genesis[alias] = constructor;
	return constructor;
};

p.parse = function(config){
	var me = this;
	var _parse = function(config){
		var constructor = me._genesis[config.alias]
		var options = config.options;
		var children = config.children;
		var one = new constructor(options);
		
		for(var i = 0, l = children.length; i < l; i++){
			var child = _parse(children[i]);
			one.addChild(child);
		}
		return one;
	}

	return _parse(config);

};

module.exports = Creator;
