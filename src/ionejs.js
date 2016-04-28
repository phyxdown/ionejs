//init ionejs namespace
var ionejs = {};

//ionejs.core
var Action = require('./core/Action');
var Event = require("./core/Event");
var One = require("./core/One");
var Stage = require("./core/ones/Stage");
var Painter = require("./core/ones/Painter");
var Cliper = require("./core/ones/Cliper");
var Writer = require("./core/ones/Writer");
var Phantom = require("./core/ones/Phantom");

//ionejs.geom
var Point = require("./geom/Point");
var Matrix2D = require("./geom/Matrix2D");

//ionejs.helpers
var Creator = require("./helpers/Creator");

//ionejs.utils
var inherits = require("./utils/inherits");

//init creator
var creator = new Creator();

//register ones
creator.defaultAlias = 'One';
creator.set('One', One);
creator.set('Stage', Stage);
creator.set('Painter', Painter);
creator.set('Cliper', Cliper);
creator.set('Writer', Writer);
creator.set('Phantom', Phantom);

//API
ionejs.inherits = inherits;
ionejs.create = function(config){
	return creator.create(config);
};
ionejs.register = function(alias, constructor){
	return creator.set(alias, constructor);
};
ionejs.blur = function(object1, p1, value, param){
    object1[p1] = object1[p1] == value ? 
        object1[p1] : object1[p1]*(1-param) + value*param;
};

//Action
ionejs.Action = Action;

//Abstract Constructors
ionejs.One = One;
ionejs.Stage = Stage;
ionejs.Painter = Painter;
ionejs.Writer = Writer;
ionejs.Event = Event;
ionejs.Phantom = Phantom;
ionejs.Cliper = Cliper;

//Helpful Classes
ionejs.Point = Point;
ionejs.Matrix2D = Matrix2D;

module.exports = ionejs;
