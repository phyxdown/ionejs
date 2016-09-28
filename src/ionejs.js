//Namespace
//genesis
var genesis = require('./genesis');

var ionejs = genesis.ones;

//Core
ionejs.Action = require('./core/Action');
ionejs.Event = require("./core/Event");
ionejs.One = require("./core/One");

var register = require("./helpers/register")
    register.Ones['One'] = ionejs.One;

//Geom
ionejs.Point = require("./geom/Point");
ionejs.Matrix2D = require("./geom/Matrix2D");

var creator = require("./helpers/creator");
    creator.defaultAlias = 'One';
ionejs.create = creator.create.bind(creator);

var definer = require('./helpers/definer');
ionejs.define = definer.define.bind(definer);
ionejs.defineOne = definer.defineOne.bind(definer);
ionejs.defineAction = definer.defineAction.bind(definer);
ionejs.defineTempalte = definer.defineTemplate.bind(definer);

ionejs.inherits = require('./utils/inherits');

ionejs.damping = require('./helpers/damping');

module.exports = ionejs;
