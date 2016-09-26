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

        if(config.template) {
            if(typeof config.template == 'function')
                config = config.template(config);
            else {
                var template = register.Templates[config.template];
                if(template)
                    config = template(config);
            }
        }

        config = config || {};
        var One = register.Ones[config.alias || I.defaultAlias]
        var options = config.options || {};

        var actions = config.actions || [];
        var children = config.children || [];

        var one = new One(options);
        actions.forEach(function(action) {
            if(typeof action == 'function')
                one.addAction(definer.defineAction(action));
            else if ((typeof action == 'string') && (action.startsWith('@'))) {
                var alias = action.slice(1);
                action = register.Actions[alias];
                if(action)
                    one.addAction(action);
                else 
                    console.log("Action: ", alias, " not registered.");
            }
            else
                one.addAction(definer.defineAction(action));
        });
        children.forEach(function(config) {
            one.addChild(_create(config));
        }); return one; }
    return _create.apply(this, arguments);
};

module.exports = new Creator();
