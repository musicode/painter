/**
 * @file 使用箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('../style');
    var eventEmitter = require('../eventEmitter');

    var zoomOut = require('../util/zoomOut');
    var window2Canvas = require('../util/window2Canvas');
    var saveDrawingSurface = require('../util/saveDrawingSurface');
    var restoreDrawingSurface = require('../util/restoreDrawingSurface');

    var Arrow = require('../shape/Arrow');

    var namespace = '.painter_action_arrow';

    function getPoint(canvas, e) {
        var point = window2Canvas(canvas, e);
        return zoomOut(point, canvas.width, canvas.height);
    }

    exports.start = function (context) {

        var canvas = context.canvas;

        var shape;
        var drawingSurface;

        var doc = $(document);

        $(canvas).on(
            'mousedown' + namespace,
            function (e) {

                drawingSurface = saveDrawingSurface(context);

                var point = getPoint(canvas, e);

                shape = new Arrow({
                    x: point.x,
                    y: point.y,
                    lineWidth: style.getLineWidth(),
                    strokeStyle: style.getStrokeStyle(),
                    fillStyle: style.getFillStyle()
                });

                doc.on(
                    'mousemove' + namespace,
                    function (e) {

                        restoreDrawingSurface(context, drawingSurface);

                        var point = getPoint(canvas, e);

                        shape.endX = point.x;
                        shape.endY = point.y;

                        exports.draw(context, shape);

                    }
                )
                .on(
                    'mouseup' + namespace,
                    function () {

                        restoreDrawingSurface(context, drawingSurface);

                        eventEmitter.trigger(
                            eventEmitter.SHAPE_ADD,
                            {
                                shape: shape
                            }
                        );

                        doc.off(namespace);

                    }
                );

            }
        );

    };

    exports.end = function (context) {
        $(context.canvas).off(namespace);
    };

    exports.draw = function (context, shape) {
        shape.createPath(context);
        shape.fill(context);
    };

});