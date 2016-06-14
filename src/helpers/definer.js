var creator = require('./creator');
var One = require('../core/One');
var Action = require('../core/Action');

var Definer = function(){};
var p = Definer.prototype;

p.defineOne = function(options, alias) {
    return this.define(options, One, alias);
}

p.defineAction = function(options, alias) {
    return this.define(options, Action, alias);
}

p.define = function(optionsOrUpdate, superConstruct, alias){

    //Practice to tell whether the check below is necessary.
    //if(typeof superConstruct != 'function')
    //    throw new Error('SuperConstruct is not function but ' + typeof superConstruct);
    //if(typeof alias != 'string')
    //    throw new Error('Alias is not string but ' + typeof alias);

    var options;
    if(typeof optionsOrUpdate == 'function') options = { update: optionsOrUpdate }
    else options = optionsOrUpdate;

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
    var baseConstruct = construct;
    while(baseConstruct._super != undefined)
        baseConstruct = baseConstruct._super;
    if(baseConstruct == One) creator.Ones[alias] = construct;
    if(baseConstruct == Action) creator.Actions[alias] = construct;
    return construct;
};

module.exports = new Definer();
