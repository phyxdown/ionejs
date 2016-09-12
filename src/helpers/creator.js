var register = require('./register');
var definer = require('./definer');

var Creator = function(){};

var p = Creator.prototype;

p.create = function(){
    var I = this;
    var _create = function(conf){
	    var config;
        if (typeof conf == 'string')
            config = {
                alias: conf
            };
	    else if (conf instanceof Array)
            config = {
                children: conf
            };
	    else config = conf;

        config = config || {};
        var One = register.Ones[config.alias || I.defaultAlias]
        var options = config.options || {};
        var groupOptions = config.groupOptions || {};

        var actions = config.actions || [];
        var children = config.children || [];

        var one = new One(options, groupOptions);
        actions.forEach(function(aliasOrUpdate) {
            if(typeof aliasOrUpdate == 'function') {
                one.addAction(definer.defineAction(aliasOrUpdate));
            } else 
                one.addAction(register.Actions[aliasOrUpdate]);
        });
        children.forEach(function(config) {
            one.addChild(_create(config));
        });
        return one;
    }
    return _create.apply(this, arguments);
};

module.exports = new Creator();
