define(function(require, exports, module) {

    var Engine = require("./core/Engine");

    var ionejs = {};

    ionejs.instance = new Engine();
    
    ionejs.Event = require("./core/Event");

    ionejs.inherits = require("./utils/inherits");

    ionejs.One = require("./core/One");
    ionejs.Stage = require("./core/ones/Stage");
    ionejs.Painter = require("./core/ones/Painter");

    module.exports = ionejs;

});