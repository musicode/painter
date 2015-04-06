/**
 * @file 画笔
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var extend = require('./util/extend');
    var zoomOut = require('./util/zoomOut');
    var window2Canvas = require('./util/window2Canvas');
    var saveDrawingSurface = require('./util/saveDrawingSurface');
    var restoreDrawingSurface = require('./util/restoreDrawingSurface');
    var chaikinCurve = require('./algorithm/chaikinCurve');

    var style = require('./style');

    /**
     *
     * @param {Object} options
     * @property {CanvasRenderingContext2D} options.context
     * @property {Function} options.onAddShape
     */
    function Painter(options) {
        extend(this, options);
    }

    Painter.prototype = {

        constructor: Painter,

        /**
         * 开始画形状
         *
         * @param {string} name 形状名称
         */
        start: function (name) {

            var me = this;

            var context = me.context;
            var canvas = context.canvas;

            var data = map[ name ];
            var Shape = data.shape;
            var dragging = data.dragging;
            var draggend = data.draggend;
            var draw = data.draw;

            var shape;
            var points;
            var drawingSurface;


            var onmousemove = function (e) {

                restoreDrawingSurface(context, drawingSurface);

                points.push(getPoint(canvas, e));

                extend(
                    shape,
                    dragging(points)
                );

                draw(shape, context);

            };

            var onmouseup = function () {

                restoreDrawingSurface(context, drawingSurface);

                if (draggend) {
                    extend(
                        shape,
                        draggend(points)
                    );
                }

                me.onAddShape(shape, draw);

                document.removeEventListener(
                    'mousemove',
                    onmousemove
                );

                document.removeEventListener(
                    'mouseup',
                    onmouseup
                );

            };

            var onmousedown = function (e) {

                drawingSurface = saveDrawingSurface(context);

                var point = getPoint(canvas, e);

                shape = new Shape({
                    x: point.x,
                    y: point.y,
                    lineWidth: style.getLineWidth(),
                    strokeStyle: style.getStrokeStyle(),
                    fillStyle: style.getFillStyle()
                });

                points = [ point ];

                document.addEventListener(
                    'mousemove',
                    onmousemove
                );

                document.addEventListener(
                    'mouseup',
                    onmouseup
                );

            };

            canvas.addEventListener(
                'mousedown',
                onmousedown
            );

            me.onmousedown = onmousedown;

        },

        /**
         * 停止绘制
         */
        end: function () {

            var me = this;
            var canvas = me.context.canvas;

            var onmousedown = me.onmousedown;

            if (onmousedown) {

                canvas.removeEventListener(
                    'mousedown',
                    onmousedown
                );

                me.onmousedown = null;

            }

        },

        text: function () {

        }

    };

    var map = {

        line: {
            shape: require('./shape/Line'),
            dragging: function (points) {

                var end = points[ points.length - 1 ];

                return {
                    endX: end.x,
                    endY: end.y
                };

            },
            draw: function (shape, context) {
                shape.createPath(context);
                shape.stroke(context);
            }
        },
        doodle: {
            shape: require('./shape/Doodle'),
            dragging: function (points) {
                return {
                    points: points
                };
            },
            draggend: function (points) {
                var len = points.length;
                if (len > 2) {
                    for (var i = 0; i < 3; i++) {
                        points = chaikinCurve(points);
                    }
                }
                return {
                    points: points
                };
            },
            draw: function (shape, context) {
                shape.createPath(context);
                shape.stroke(context);
            }
        },
        rect: {
            shape: require('./shape/Rect'),
            dragging: function (points) {

                var start = points[ 0 ];
                var end = points[ points.length - 1 ];

                var startX = Math.min(start.x, end.x);
                var startY = Math.min(start.y, end.y);
                var endX = Math.max(start.x, end.x);
                var endY = Math.max(start.y, end.y);

                return {
                    x: startX,
                    y: startY,
                    width: endX - startX,
                    height: endY - startY
                };
            },
            draw: function (shape, context) {
                shape.createPath(context);
                shape.stroke(context);
            }
        },
        ellipse: {
            shape: require('./shape/Ellipse'),
            dragging: function (points) {

                var start = points[ 0 ];
                var end = points[ points.length - 1 ];

                return {
                    width: Math.abs(end.x - start.x),
                    height: Math.abs(end.y - start.y)
                };
            },
            draw: function (shape, context) {
                shape.createPath(context);
                shape.stroke(context);
            }
        },
        arrow: {
            shape: require('./shape/Arrow'),
            dragging: function (points) {

                var end = points[ points.length - 1 ];

                return {
                    endX: end.x,
                    endY: end.y
                };
            },
            draw: function (shape, context) {
                shape.createPath(context);
                shape.fill(context);
            }
        }
/**
        text: {
            shape: require('./shape/Text'),
            dragging: function () {

            },
            draw: function (shape, context) {
                shape.createPath(context);
                shape.stroke(context);
            }
        }
*/

    };

    function getPoint(canvas, e) {
        var point = window2Canvas(canvas, e.clientX, e.clientY);
        return zoomOut(point, canvas.width, canvas.height);
    }


    return Painter;

});
