var definer = require('../../helpers/definer');
var _ = require('underscore');

definer.defineOne({
    afterCreate: function() {
        this.mReset();
    },

    set: function(one) {
        if (one instanceof One || one == null) {
            this._origin = one;
        } else {
            console.log("#phantom.set#", "illegal params.");
        }
    },

    mTrz: function(matrix){
        this.mM = matrix;
    },

    mTsl: function(x, y){
        this.mX = x;
        this.mY = y;
    },

    mReset: function(){
        this.mM = this.getAbsoluteMatrix();
        this.mX = 0;
        this.mY = 0;
    },

    draw: function(context) {
        var m = this.mM;
        var x = this.mX;
        var y = this.mY;
        context.save();
        context.translate(x, y);
        context.transform(m.a, m.b, m.c, m.d, m.x, m.y);

        if (this._origin)
            this._origin._draw(context);
        
        context.restore();
    }
}, 'ionejs.Phantom');
