var creator = require('./creator');
var One = require('../core/One');
var Action = require('../core/Action');

var Definer = function(){};
var p = Definer.prototype;

p.define = function(options, superConstruct, alias){
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
    //Better implementation is expected.
    var sample = new construct();
    if ((alias != undefined) && (sample instanceof One)) creator.Ones[alias] = construct;
    if ((alias != undefined) && (sample instanceof Action)) creator.Actions[alias] = construct;
    return construct;
};

module.exports = new Definer();
