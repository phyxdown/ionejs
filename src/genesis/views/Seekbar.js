var _ = require('underscore');
var definer = require('../../helpers/definer');
/**
 *
 * @option horizontal
 * true of false to decide whether the seekbar is horizontal or vertical
 *
 * @option referencePoint
 * leftTop rightTop leftBottom rightBottom
 *
 * @option breadth
 *
 * @option length
 *
 * @option occupancy  
 * window size devided by content size
 *
 * @option deviation
 * distance between content reference point and window reference point devided by content size
 * */
module.exports = definer.defineTemplate(function(config) {
    return {
        options: _.defaults(config.options, {
            group: 'Seekbar'
        }),
        actions: config.actions,
        children: [{
            alias: 'uonejs.ones.Rect',
            options: {
                fillStyle: '#EEE5DE'
            },
            actions: [" \
                if(!GS.horizontal) { \
                    S.width = GS.breadth; \
                    S.height = GS.length; \
                } else { \
                    S.width = GS.length; \
                    S.height = GS.breadth; \
                } \
                switch(GS.referencePoint) { \
                    case 'rightBottom': \
                        S.x = -S.width; \
                        S.y = -S.height; \
                        break; \
                    case 'leftBottom': \
                        S.x = 0; \
                        S.y = -S.height; \
                        break; \
                    case 'rightTop': \
                        S.x = -S.width; \
                        S.y = 0; \
                        break; \
                    default: \
                        break; \
                } \
            "],
            children: [{
                alias: 'uonejs.ones.Rect',
                options: {
                    fillStyle: '#E0EEEE'
                },
                actions: [
                    " \
                    if(!GS.horizontal) { \
                        S.width = PS.width; \
                        S.height = PS.height * GS.occupancy; \
                        S.y = PS.height * GS.deviation; \
                    } else { \
                        S.height = PS.height; \
                        S.width = PS.width * GS.occupancy; \
                        S.x = PS.width * GS.deviation; \
                    }", 
                    "@SupportMousedrag"
                ]
            }]
        }]
    };
}, 'Seekbar');
