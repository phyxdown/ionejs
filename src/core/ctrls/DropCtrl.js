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

var _downX = 0;
var _downY = 0;

p.init = function(stage) {
    var me = this;

    stage.addEventListener('mousedown', function(e) {
        me.down = true;
        if (e.target._state.dropable) {
            var dropSource = e.target;
            me.phantom.set(dropSource);
            me.phantom.mReset();
            me.phantom.mTrz(dropSource.getParent().getAbsoluteMatrix());
            me.dropSource = dropSource;
            _downX = e.global.x;
            _downY = e.global.y;
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
        me.phantom.mTsl(e.global.x - _downX, e.global.y - _downY);
    });
}

module.exports = new DropCtrl();


