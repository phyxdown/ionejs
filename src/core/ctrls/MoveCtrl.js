define(function(require, exports, module) {

    var MoveCtrl = function(){
        this.down = false;
        this.moveSource = null;
    };

    var p = MoveCtrl.prototype;

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
            me.moveSource.x += e.dx;
            me.moveSource.y += e.dy;
            me.moveSource.targetX = me.moveSource.x;
            me.moveSource.targetY = me.moveSource.y;
        });
    }

    module.exports = new MoveCtrl();

});