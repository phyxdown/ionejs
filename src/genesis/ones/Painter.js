import { definer } from '../../helpers/index.js';
import _ from 'underscore';

export var Painter = definer.defineOne({
    testHit: function(point) {
        var I = this, S = I.state;
        if (!I.image) return false;
        else {
            var width = S.width || I.image.width;
            var height = S.height || I.image.height;
            return point.x > 0 && point.x < width && point.y > 0 && point.y < height;
        }
    },
    loadif: function() {
        var I = this;
        var S = this.state;
        if(!S.src) return;
        if (!I.image) {
            I.image = new Image();
            I.image.src = S.src;
        }
        else if (I.image.src != S.src)
            I.image.src = S.src;
    },
    update: function() {
        var I = this, S = I.state; I.loadif();
        if (!!I.image) {
            S.width = S.width || I.image.width;
            S.height = S.height || I.image.height;
        }
    },
    draw: function(context) {
        var I = this, S = I.state;
        if(!I.image) return;
        if((S.width != undefined) && (S.height != undefined))
            context.drawImage(I.image, 0, 0, S.width, S.height);
        else
            context.drawImage(I.image, 0, 0);
    }
}, 'Painter');
