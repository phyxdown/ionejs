var _ = require('underscore');
var Seekbar = require('./Seekbar');
var Event = require('../../core/Event');

var definer = require('../../helpers/definer');
var WindowEvent = definer.defineEvent({
    SCROLL: 'uonejs.Window.SCROLL',
    CONTENTRESIZE: 'uonejs.Window.CONTENTRESIZE'
});

/*
 * A window which can contain scalable content.
 *
 * @tempalate Window
 *
 * @option width
 * @option height
 * @option seekbarBreadth
 *
 * @state offsetX
 * @state offsetY
 * @state realWidth
 * @state realHeight
 * @state visualWidth
 * @state visualHeight
 *
 * @action all actions will be added to leader.
 *
 * @children all children will be added into a container.
 * */
module.exports = definer.defineTemplate(function(config) {
    config.options = config.options || {};
    var options = _.defaults(config.options, {
        group: 'Window',
        offsetX: 0,
        offsetY: 0
    });
    /*
     * A new concept about one's width and height will turn.
     * And the logic above might be remnant.
     */
    var firstChild = config.children[0];
    if(firstChild) {
        firstChild.actions = firstChild.actions || [];
        firstChild.actions.push({
            originWidth: undefined,
            originHeight: undefined,
            update: function() {
                var A = this, I = this.one, S = I.state;
                if((S.width != A.originWidth) || (S.height != A.originHeight)) {
                    I.fire(new WindowEvent({
                        type: WindowEvent.CONTENTRESIZE,
                        width: S.width,
                        height: S.height
                    }));
                    A.originWidth = S.width;
                    A.originHeight = S.height;
                }
            }
        });
    }
    var children = [
        {
            template: Seekbar,
            options: {
                name: 'horizontalSeekbar',
                horizontal: true,
                referencePoint: "leftTop"
            },
            actions: [" \
                if (GS.visualHeight == GS.height) { \
                    I.stopDraw(); \
                    I.stopUpdate(); \
                    return; \
                } \
                I.state.x = 0;\
                I.state.y = GS.visualHeight;\
                S.occupancy = GS.visualWidth/GS.realWidth; \
                S.deviation = GS.offsetX/GS.realWidth; \
                S.length = GS.visualWidth;\
                S.breadth = GS.seekbarBreadth;\
            ", 
            {
                afterMount: " \
                    I.on('mousedrag', function(e) { \
                        GS.offsetX += (e.data.paternalDistance.x / S.occupancy); \
                        GS.offsetX = Math.max(GS.offsetX, 0); \
                        GS.offsetX = Math.min(GS.offsetX, GS.realWidth - GS.visualWidth); \
                    });" 
            }]

        },
        {
            template: Seekbar,
            options: {
                name: 'verticalSeekbar',
                horizontal: false,
                referencePoint: "leftTop"
            },
            actions: [" \
                if (GS.visualWidth == GS.width) { \
                    I.stopDraw(); \
                    I.stopUpdate(); \
                    return; \
                } \
                I.state.x = GS.visualWidth;\
                I.state.y = 0;\
                S.occupancy = GS.visualHeight/GS.realHeight; \
                S.deviation = GS.offsetY/GS.realHeight; \
                S.length = GS.visualHeight;\
                S.breadth = GS.seekbarBreadth;\
            ", 
            {
                afterMount: " \
                    I.on('mousedrag', function(e) { \
                        GS.offsetY += (e.data.paternalDistance.y / S.occupancy); \
                        GS.offsetY = Math.max(GS.offsetY, 0); \
                        GS.offsetY = Math.min(GS.offsetY, GS.realHeight - GS.visualHeight); \
                    });"
            }]
        }, {
            alias: 'Cliper',
            options: {
                name: 'container'
            },
            actions: [" \
                S.startX = 0; \
                S.startY = 0; \
                S.width = GS.visualWidth; \
                S.height = GS.visualHeight; \
            "],
            children: [{
                actions: [" \
                    S.x = -GS.offsetX; \
                    S.y = -GS.offsetY; \
                "],
                children: config.children
            }]
        }
    ];
    var actions = [" \
        if (S.visualHeight == undefined) S.visualHeight = S.height; \
        if (S.visualWidth == undefined) S.visualWidth = S.width; \
        if (S.visualWidth < S.realWidth) \
            S.visualHeight = S.height - S.seekbarBreadth; \
        else \
            S.visualHeight = S.height; \
        if (S.visualHeight < S.realHeight) \
            S.visualWidth = S.width - S.seekbarBreadth; \
        else \
            S.visualWidth = S.width; \
    ", 
    {
        afterMount: function() {
            var I = this.one, S = I.state;
            I.on(WindowEvent.CONTENTRESIZE, function(e) {
                if(e.data.width != undefined)
                    S.realWidth = e.data.width;
                if(e.data.height != undefined)
                    S.realHeight = e.data.height;
                e.stopPropagation();
            });
        }
    }];
    if(config.actions)
        actions = actions.concat(config.actions);
    return {
        options: options,
        children: children,
        actions: actions
    };
}, 'Window');
