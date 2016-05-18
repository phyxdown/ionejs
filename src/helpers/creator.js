var Creator = function(){
    this.Ones = {};
    this.Actions = {};
};

var p = Creator.prototype;

p.create = function(){
    var I = this;
    var _create = function(conf){
	var config;
        if (typeof conf == 'string')
	    config = {
                alias: conf
	    };
	if (conf instanceof Array) {
	    config = {
                children: conf
	    };

        config = config || {};
        var One = I.Ones[config.alias || I.defaultAlias]
        var options = config.options || {};

        var actions = config.actions || [];
        var children = config.children || [];

        var one = new One(options);
        actions.forEach(function(alias) {
            one.addAction(I.Actions[alias]);
        });
        children.forEach(function(config) {
            one.addChild(_create(config));
        });
        return one;
    }
    return _create.apply(this, arguments);
	}

        var config = config || {};
        var One = I.Ones[config.alias || I.defaultAlias]
        var options = config.options || {};

        var actions = config.actions || [];
        var children = config.children || [];

        var one = new One(options);
        actions.forEach(function(alias) {
            one.addAction(I.Actions[alias]);
        });
        children.forEach(function(config) {
            one.addChild(_create(config));
        });
        return one;
    }
    return _create.apply(this, arguments);
};

module.exports = new Creator();
