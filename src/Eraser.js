/**
 * @file 橡皮擦
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var extend = require('./util/extend');
    var window2Canvas = require('./util/window2Canvas');
    var saveDrawingSurface = require('./util/saveDrawingSurface');
    var restoreDrawingSurface = require('./util/restoreDrawingSurface');

    /**
     *
     * @param {Object} options
     * @property {CanvasRenderingContext2D} options.context
     * @property {Function} options.onRemoveShape
     */
    function Eraser(options) {
        extend(this, options);
    };

    Eraser.prototype = {

        constructor: Eraser,

        /**
         * 开始擦除
         *
         * @param {Function} iterator 形状遍历器
         */
        start: function (iterator) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            var drawingSurface = saveDrawingSurface(context);

            var shape;

            var onmousedown = function (e) {
                if (shape) {
                    restoreDrawingSurface(context, drawingSurface);
                    me.onRemoveShape(shape);
                }
            };

            var onmousemove = function (e) {

                var point = window2Canvas(canvas, e.clientX, e.clientY);

                restoreDrawingSurface(context, drawingSurface);

                shape = null;

                iterator(
                    function (shapeItem) {
                        if (shapeItem.inRect(point)) {
                            shape = shapeItem;
                        }
                    }
                );

                if (shape) {
                    shape.showBoundary(context);
                }

            };

            canvas.addEventListener(
                'mousedown',
                onmousedown
            );

            canvas.addEventListener(
                'mousemove',
                onmousemove
            );

            me.onmousedown = onmousedown;
            me.onmousemove = onmousemove;

        },

        /**
         * 结束擦除
         */
        end: function () {

            var me = this;
            var onmousedown = me.onmousedown;
            var onmousemove = me.onmousemove;

            if (onmousedown && onmousemove) {

                var canvas = me.context.canvas;

                canvas.removeEventListener(
                    'mousedown',
                    onmousedown
                );

                canvas.removeEventListener(
                    'mousemove',
                    onmousemove
                );

                me.onmousedown =
                me.onmousemove = null;

            }

        }

    };

    return Eraser;

});