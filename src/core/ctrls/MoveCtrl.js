define(function(require, exports, module) {

    var MoveCtrl = function(){
        this.down = false;
        this.moveSource = null;
    };

    var p = MoveCtrl.prototype;

    var _downX = 0;
    var _downY = 0;

    p.init = function(stage){
        var me = this;

        stage.addEventListener('mousedown', function(e){
            me.down = true;
            if(e.target._moveable)
                me.moveSource = e.target;
        });

        stage.addEventListener('mouseup', function(e){
            me.down = false;
            me.dropSource = null;
        });

        stage.addEventListener('mousemove', function(e){
            if(!me.moveSource) return;
            if(!me.down) {
                me.moveSource = null;
                return;
            }
            me.moveSource.x = e.global.x - _downX;
            me.moveSource.y = e.global.y - _downY;
            me.moveSource.targetX = me.moveSource.x;
            me.moveSource.targetY = me.moveSource.y;
        });
    }

    module.exports = new MoveCtrl();

});