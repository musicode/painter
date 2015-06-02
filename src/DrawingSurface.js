/**
 * @file 绘图表面
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    function DrawingSurface() {

    }

    DrawingSurface.prototype = {

        constructor: DrawingSurface,

        save: function (painter) {

            var context = painter.context;
            var canvas = context.canvas;

            if (context.getImageData) {
                this.imageData = context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            }

        },

        restore: function (painter) {

            var context = painter.context;

            if (context.putImageData) {
                context.putImageData(this.imageData, 0, 0);
            }
            else {
                painter.refresh();
            }

        }

    };


    return DrawingSurface;

});