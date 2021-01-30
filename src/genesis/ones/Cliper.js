import { definer } from '../../helpers/index.js';

export var Cliper = definer.defineOne({
    draw: function(context) {
        var I = this, S = I.state;
        context.beginPath(); 
        context.rect(S.startX, S.startY, S.width, S.height);
        context.clip();
        context.closePath();
    }
}, 'Cliper');
