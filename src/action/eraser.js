/**
 * @file 使用箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('../style');
    var eventEmitter = require('../eventEmitter');

    var window2Canvas = require('../util/window2Canvas');
    var saveDrawingSurface = require('../util/saveDrawingSurface');
    var restoreDrawingSurface = require('../util/restoreDrawingSurface');

    var namespace = '.painter_action_eraser';

    exports.start = function (context, iterator) {

        var canvas = context.canvas;
        var drawingSurface = saveDrawingSurface(context);

        var shape;

        $(canvas)
        .on('mousedown' + namespace, function () {

            restoreDrawingSurface(context, drawingSurface);

            eventEmitter.trigger(
                eventEmitter.SHAPE_REMOVE,
                {
                    shape: shape
                }
            );

            drawingSurface = saveDrawingSurface(context);

        })
        .on('mousemove' + namespace, function (e) {

            restoreDrawingSurface(context, drawingSurface);

            var point = window2Canvas(canvas, e);

            shape = null;

            iterator(
                function (shapeItem) {
                    if (shapeItem.isPointInPath(context, point)) {
                        shape = shapeItem;
                    }
                }
            );

            if (shape) {
                shape.createBoundaryPath(context);
                context.save();
                context.fillStyle = 'rgba(0,0,0,0.2)';
                context.fill();
                context.restore();
            }


        });

    };

    exports.end = function (context) {
        $(context.canvas).off(namespace);
    };

});