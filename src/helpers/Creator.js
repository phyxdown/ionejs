var Creator = function(){
	this._genesis = {};
};

var p = Creator.prototype;

p.set = function(alias, constructor){
	this._genesis[alias] = constructor;
	return constructor;
};

p.create = function(){
	var me = this;
	var _parse = function(){
		var config = arguments[0] || {};
		var constructor = me._genesis[config.alias || me.defaultAlias]
		var options = config.options || {};
		var children = config.children || [];
		var one = new constructor(options);
		
		for(var i = 0, l = children.length; i < l; i++){
			var child = _parse(children[i]);
			one.addChild(child);
		}
		return one;
	}

	return _parse.apply(this, arguments);

};

p.

module.exports = Creator;
