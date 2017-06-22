var register = require('./register');
var One = require('../core/One');
var Action = require('../core/Action');
var Event = require('../core/Event');

var Definer = function(){};
var p = Definer.prototype;

p.defineOne = function(options, alias) {
    return this.define(options, One, alias);
}

p.defineAction = function(options, alias) {
    return this.define(options, Action, alias);
}

p.defineEvent = function(options) {
    var E = this.define({}, Event);
    for (var key in options) {
        E[key] = options[key];
    }
    return E;
}

p.defineTemplate = function(template, alias) {
    register.Templates[alias] = template;
    return template;
}

p.define = function(optionsOrUpdate, superConstruct, alias){
    alias = alias || 'anonymous';
    superConstruct = superConstruct || One;

    //Practice to tell whether the check below is necessary.
    //if(typeof superConstruct != 'function')
    //    throw new Error('SuperConstruct is not function but ' + typeof superConstruct);
    //if(typeof alias != 'string')
    //    throw new Error('Alias is not string but ' + typeof alias);

    function parseOneMethod(script) {
       var pref = "var I = this;var S = I.state;var P = I.getParent();var PS = P.state;var L = I.getLeader();var GS = I.getGroupState();"
       return new Function(pref + script);
    }

    function parseActionMethod(script) {
       var pref = "var A = this;var I = A.one;var S = I.state;var P = I.getParent();var PS = P.state;var L = I.getLeader();var GS = I.getGroupState();"
       return new Function(pref + script);
    }

    var baseConstruct = superConstruct;
    while(baseConstruct._super != undefined)
        baseConstruct = baseConstruct._super;

    var parseMethod;
    if(baseConstruct == One) parseMethod = parseOneMethod;
    if(baseConstruct == Action) parseMethod = parseActionMethod;

    var options;
    if(typeof optionsOrUpdate == 'function') options = { update: optionsOrUpdate }
    else if(typeof optionsOrUpdate == 'string') options = { update: parseMethod(optionsOrUpdate) }
    else options = optionsOrUpdate || {};

    var lifecircleMethodnames = ["update", "afterCreate", "afterMount", "beforeMount", "beforeUnmount", "afterUnmount"];
    lifecircleMethodnames.forEach(function(methodname) {
        if(typeof options[methodname] == 'string')
            options[methodname] = parseMethod(options[methodname]);
    });

    var fields = {};
    var methods = {};

    for (var i in options) {
        if (typeof options[i] == 'function') 
            methods[i] = options[i];
        else
            fields[i] = options[i];
    }

    var construct = function() {
        var I = this;
        if (superConstruct != undefined) {
            superConstruct.apply(I, arguments);
            I._super = superConstruct.prototype;
            I._alias = alias;
        }
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

    if(baseConstruct == One) register.Ones[alias] = construct;
    if(baseConstruct == Action) register.Actions[alias] = construct;
    return construct;
};

module.exports = new Definer();
