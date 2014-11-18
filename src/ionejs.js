define(function(require, exports, module){

  var ionejs = {};

  ionejs.core = {};
  ionejs.core.One = require("./core/One");
  ionejs.core.Event = require("./core/Event");
  module.exports = ionejs;

});
