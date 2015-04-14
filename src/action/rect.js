/**
 * @file 使用矩形
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

    var Rect = require('../shape/Rect');

    var namespace = '.painter_action_rect';

    function getPoint(canvas, e) {
        var point = window2Canvas(canvas, e);
        return zoomOut(point, canvas.width, canvas.height);
    }

    exports.start = function (context) {

        var canvas = context.canvas;

        var shape;
        var drawingSurface;

        var startPoint;

        var doc = $(document);

        $(canvas).on(
            'mousedown' + namespace,
            function (e) {

                drawingSurface = saveDrawingSurface(context);

                startPoint = getPoint(canvas, e);

                shape = new Rect({
                    lineWidth: style.getLineWidth(),
                    strokeStyle: style.getStrokeStyle(),
                    fillStyle: style.getFillStyle()
                });

                doc.on(
                    'mousemove' + namespace,
                    function (e) {

                        restoreDrawingSurface(context, drawingSurface);

                        var point = getPoint(canvas, e);

                        var startX = Math.min(startPoint.x, point.x);
                        var startY = Math.min(startPoint.y, point.y);
                        var endX = Math.max(startPoint.x, point.x);
                        var endY = Math.max(startPoint.y, point.y);

                        shape.x = startX;
                        shape.y = startY;
                        shape.width = endX - startX;
                        shape.height = endY - startY;

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
        shape.stroke(context);
    };

});