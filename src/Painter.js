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

    var Shape = require('./Shape');

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
         * @param {Object} options
         * @property {string} options.name 形状名称
         * @property {number=} options.thickness 粗细
         * @property {string=} options.strokeColor 描边色
         * @property {string=} options.fillColor 填充色
         */
        start: function (options) {

            var me = this;

            var context = me.context;
            var canvas = context.canvas;

            var shape;
            var drawingSurface;

            var draw = function (action) {
                restoreDrawingSurface(context, drawingSurface);
                return shape.draw(context, action);
            };

            var addPoint = function (point) {
                point = zoomOut(point, canvas.width, canvas.height);
                shape.addPoint(point);
            };

            var onmousemove = function (e) {

                addPoint(
                    window2Canvas(canvas, e.clientX, e.clientY)
                );

                draw('move');

            };

            var onmouseup = function () {

                restoreDrawingSurface(context, drawingSurface);

                shape.format(canvas.width, canvas.height);

                me.onAddShape(shape);

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

                shape = new Shape({
                    name: options.name,
                    style: {
                        thickness: options.thickness,
                        stroke: options.strokeColor,
                        fill: options.fillColor
                    }
                });

                addPoint(
                    window2Canvas(canvas, e.clientX, e.clientY)
                );

                if (draw('down')) {

                    document.addEventListener(
                        'mousemove',
                        onmousemove
                    );

                    document.addEventListener(
                        'mouseup',
                        onmouseup
                    );

                }

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
            var onmousedown = me.onmousedown;

            if (onmousedown) {

                var canvas = me.context.canvas;

                canvas.removeEventListener(
                    'mousedown',
                    onmousedown
                );

                me.onmousedown = null;

            }

        }

    };

    return Painter;

});
