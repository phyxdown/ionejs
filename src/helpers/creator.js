var register = require('./register');
var definer = require('./definer');

var Creator = function(){
    this.uniqueKeyPref = 0;
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
	    else if (conf instanceof Array)
            config = {
                children: conf
            };
	    else config = conf;

        config = config || {};

        if(config.template) {
            if(typeof config.template == 'function')
                config = config.template(config);
            else if((typeof config.template == 'string') && (config.template.startsWith('@'))){
                var template = register.Templates[config.template.slice(1)];
                if(template)
                    config = template(config);
            }
        }

        var One = register.Ones[config.alias || I.defaultAlias]
        var options = config.options || {};

        var actions = config.actions || [];
        var children = config.children || [];

        var one = new One(options);

        var ts = Date.now();
        one._uniqueKey = ts + "_" + I.uniqueKeyPref;
        one.state._uniqueKey = ts + "_" + I.uniqueKeyPref + ".state";
        I.uniqueKeyPref ++;

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
