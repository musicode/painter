/**
 * @file 橡皮擦
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var extend = require('./util/extend');
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

        start: function (iterator) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            var drawingSurface = saveDrawingSurface(context);

            var onmousedown = function (e) {

                var point = window2Canvas(canvas, e.clientX, e.clientY);

                var shapes = [ ];

                iterator(
                    function (shape) {
                        if (shape.inRect(point)) {
                            shapes.push(shape);
                        }
                    }
                );

                me.onRemoveShape(shape);

            };

            var onmousemove = function (e) {

                var point = window2Canvas(effectCanvas, e.clientX, e.clientY);

                restoreDrawingSurface(context, drawingSurface);

                iterator(
                    function (shape) {
                        if (shape.inRect(point)) {
                            shape.showBoundary(context);
                        }
                    }
                );

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