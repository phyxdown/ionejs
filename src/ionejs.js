//Namespace
var ionejs = {};

//Core
ionejs.Action = require('./core/Action');
ionejs.Event = require("./core/Event");
ionejs.One = require("./core/One");

//Base
ionejs.Stage = require("./core/ones/Stage");
ionejs.Painter = require("./core/ones/Painter");
ionejs.Cliper = require("./core/ones/Cliper");
ionejs.Writer = require("./core/ones/Writer");
ionejs.Phantom = require("./core/ones/Phantom");

//Geom
ionejs.Point = require("./geom/Point");
ionejs.Matrix2D = require("./geom/Matrix2D");

var creator = require("./helpers/creator");
    creator.defaultAlias = 'One';
    creator.Ones['One'] = ionejs.One;
    creator.Ones['Stage'] = ionejs.Stage;
    creator.Ones['Painter'] = ionejs.Painter;
    creator.Ones['Cliper'] = ionejs.Cliper;
    creator.Ones['Writer'] = ionejs.Writer;
    creator.Ones['Phantom'] = ionejs.Phantom;

ionejs.create = function(config) {
    return creator.create(config);
};

ionejs.registerOne = function(alias, One) {
    creator.Ones[alias] = One;
};

ionejs.registerAction = function(alias, Action) {
    creator.Actions[alias] = Action;
}

ionejs.inherits = require('./utils/inherits');
ionejs.blur = require('./utils/blur');
module.exports = ionejs;
