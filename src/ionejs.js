define(function(require, exports, module) {
	//init ionejs namespace
	var ionejs = {};

    //ionejs.core
    var Engine = require("./core/Engine");
    var Event = require("./core/Event");
    var One = require("./core/One");
    var Stage = require("./core/ones/Stage");
    var Painter = require("./core/ones/Painter");
    var Cliper = require("./core/ones/Cliper");
    var Writer = require("./core/ones/Writer");

    //ionejs.core.hitTests
    var hitTests = require("./core/hitTests/all");

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
    creator.set('One', One);
    creator.set('Stage', Stage);
    creator.set('Painter', Painter);
    creator.set('Cliper', Cliper);
    creator.set('Writer', Writer);

    //API
    ionejs.inherits = inherits;
    ionejs.create = function(config){
    	return creator.parse(config);
    };
    ionejs.register = function(alias, constructor){
    	return creator.set(alias, constructor);
    };
    ionejs.blur = function(object, p1, p2, param){
        object[p1] = object[p1] == object[p2] ? 
            object[p1] : object[p1]*(1-param) + object[p2]*param;
    };

    //Abstract Constructors
    ionejs.One = One;
    ionejs.Stage = Stage;
    ionejs.Painter = Painter;
    ionejs.Writer = Writer;
    ionejs.Event = Event;
    ionejs.hitTests = hitTests;

    //Helpful Classes
    ionejs.Point = Point;
    ionejs.Matrix2D = Matrix2D;
    
    //Helpful Functions
    ionejs.hitTests = hitTests;

    //instance
    ionejs.instance = new Engine();

    module.exports = ionejs;

});