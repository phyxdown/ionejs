define(function(require, exports, module) {

    var DropEvent = require("../events/DropEvent");
    var Phantom = require("../ones/Phantom");

    var DropCtrl = function() {
        this.down = false;
        this.dropSource = null;
        this.phantom = new Phantom();
        this.phantom.set(null);
        this.phantom.alpha = 0.4;
    };

    var p = DropCtrl.prototype;

    p.init = function(stage) {
        var me = this;

        stage.addEventListener('mousedown', function(e) {
            me.down = true;
            if (e.target._dropable) {
                var dropSource = e.target;
                me.phantom.set(dropSource);
                // me.phantom.overlay(dropSource.getParent(), 
                // 	   ["x", "y", "scaleX", "scaleX", "rotation", "skewX", "skewY", "regX", "regY"]);
                me.phantom.mReset();
                me.phantom.mTrz(dropSource.getParent().getAbsoluteMatrix());
                me.dropSource = dropSource;
                stage.addChild(me.phantom);
            }
        });

        /**
         * Here is a bug.
         * To fix it, call stage.hit again after phantom is removed.
         */
        stage.addEventListener('mouseup', function(e) {
            me.down = false;
            var dropTarget = e.target;
            me.dropSource && dropTarget && dropTarget !== me.dropSource && dropTarget.dispatchEvent(new DropEvent({
                type: DropEvent.DROP,
                global: e.global,
                local: e.local,
                dropSource: me.dropSource
            }));
            me.dropSource = null;
            stage.removeChild(me.phantom);
            me.phantom.set(null);
        });

        stage.addEventListener('mousemove', function(e) {
            if (!me.dropSource) return;
            if (!me.down) {
                me.dropSource = null;
                stage.removeChild(me.phantom);
                return;
            }
            me.phantom.mTsl(e.dx, e.dy);
        });
    }

    module.exports = new DropCtrl();

});