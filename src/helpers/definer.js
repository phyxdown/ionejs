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
        if (superConstruct != undefined)
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
    if ((alias != undefined) && ((new construct()) instanceof One)) creator.Ones[alias] = construct;
    if ((alias != undefined) && ((new construct()) instanceof Action)) creator.Actions[alias] = construct;
    console.log((new construct()) instanceof One, (new construct()) instanceof Action);
    return construct;
};

module.exports = new Definer();
