/**
 * @file 使用画笔工具
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

    var chaikinCurve = require('../algorithm/chaikinCurve');

    var Doodle = require('../shape/Doodle');

    var namespace = '.painter_action_painter';


    function getPoint(canvas, e) {
        var point = window2Canvas(canvas, e);
        return zoomOut(point, canvas.width, canvas.height);
    }

    exports.start = function (context) {

        var canvas = context.canvas;

        var shape;
        var points;
        var drawingSurface;

        var doc = $(document);

        $(canvas).on(
            'mousedown' + namespace,
            function (e) {

                drawingSurface = saveDrawingSurface(context);

                var point = getPoint(canvas, e);

                points = [ point ];

                shape = new Doodle({
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

                        points.push(
                            getPoint(canvas, e)
                        );

                        shape.points = points;

                        exports.draw(context, shape);

                    }
                )
                .on(
                    'mouseup' + namespace,
                    function () {

                        restoreDrawingSurface(context, drawingSurface);

                        var len = points.length;
                        if (len > 2) {
                            for (var i = 0; i < 3; i++) {
                                points = chaikinCurve(points);
                            }
                        }

                        shape.points = points;

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
        $(document).off(namespace);

    };

    exports.draw = function (context, shape) {
        shape.createPath(context);
        shape.stroke(context);
    };

});