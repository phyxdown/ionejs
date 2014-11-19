define(function(require, exports, module){

	var inherits = require('../utils/inherits');
	var One = require('./One');
	var MouseEvent = require('./events/MouseEvent');
	var Point = require('../geom/Point')

	var Canvas = function(options){

	}

	var p = Canvas.prototype;

	/**
	 * Init canvas by stage.
	 * @param  {core.Stage} stage
	 */
    p.init = function(stage, div) {
        var canvas = document.createElement("canvas");
            canvas.width = stage.width;
            canvas.height = stage.height;
            div.appendChild(canvas);

		var offsetTop = canvas.offsetTop;
		var offsetLeft = canvas.offsetLeft;

		var listener = function(e){
			var global = new Point(e.pageX - offsetLeft, e.pageY - offsetTop);
            var origin = stage.hit(global);
            console.log(e.type);
            if(!origin){
                console.log("nothing hit.");
                return;
            }
            var local = origin.globalToLocal(global);
            origin.dispatchEvent(new MouseEvent({
                type: e.type,
                global: global,
                local: local
            }));
		}

		var types = ['mousedown', 'mouseup', 'click'];
		for(var index in types){
			canvas.addEventListener(types[index], listener);
		}
	};

	module.exports = Canvas;
});