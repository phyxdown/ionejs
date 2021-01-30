import { Point } from '../geom/Point.js';
import { Matrix2D } from '../geom/Matrix2D.js';

class Matrix extends Matrix2D {
	constructor(...args) {
    	if (args.length == 6)
			super(...args);
		else if (args.length == 1)
			this.transform(args[0]);
		else if (args.length == 0)
			;
		else
        	throw new Error("Illegal params for core.Matrix.");
	}

	transform(state) {
    	var x = state.x,
    	    y = state.y,
    	    scaleX = state.scaleX,
    	    scaleY = state.scaleY,
    	    rotation = state.rotation,
    	    skewX = state.skewX,
    	    skewY = state.skewY,
    	    regX = state.regX,
    	    regY = state.regY;

    	rotation *= Math.PI / 180;
    	skewX *= Math.PI / 180;
    	skewY *= Math.PI / 180;
    	var cos = Math.cos,
    	    sin = Math.sin;
    	this.prepend(1, 0, 0, 1, regX, regY);
    	this.prepend(scaleX, 0, 0, scaleY, 0, 0);
    	this.prepend(cos(rotation), sin(rotation), -sin(rotation), cos(rotation), 0, 0);
    	this.prepend(cos(skewY), sin(skewY), -sin(skewX), cos(skewX), 0, 0);
    	this.prepend(1, 0, 0, 1, x, y);
    	return this;
	}
}
export { Matrix }
