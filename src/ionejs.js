//Namespace
//genesis
var ionejs = require("./genesis/ones");

//Core
ionejs.Action = require('./core/Action');
ionejs.Event = require("./core/Event");
ionejs.One = require("./core/One");

//Geom
ionejs.Point = require("./geom/Point");
ionejs.Matrix2D = require("./geom/Matrix2D");

var creator = require("./helpers/creator");
    creator.defaultAlias = 'One';
    creator.Ones['One'] = ionejs.One;

ionejs.create = function(config) {
    return creator.create(config);
};

ionejs.registerOne = function(alias, One) {
    creator.Ones[alias] = One;
};

ionejs.registerAction = function(alias, Action) {
    creator.Actions[alias] = Action;
}

var definer = require('./helpers/definer');
ionejs.define = definer.define;

ionejs.inherits = require('./utils/inherits');
module.exports = ionejs;
