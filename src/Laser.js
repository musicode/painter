/**
 * @file 激光笔
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('./style');
    var extend = require('./util/extend');
    var window2Canvas = require('./util/window2Canvas');
    var saveDrawingSurface = require('./util/saveDrawingSurface');
    var restoreDrawingSurface = require('./util/restoreDrawingSurface');

    var Ellipse = require('./shape/Ellipse');

    function Laser(options) {
        extend(this, options);
    }

    Laser.prototype = {

        constructor: Laser,

        start: function () {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            var drawingSurface = saveDrawingSurface(context);

            var circle = new Ellipse({
                adaptive: false
            });

            var onmousemove = function (e) {

                restoreDrawingSurface(context, drawingSurface);

                var point = window2Canvas(canvas, e.clientX, e.clientY);

                extend(
                    circle,
                    point,
                    {
                        width: style.getLineWidth(),
                        height: style.getLineWidth(),
                        fillStyle: style.getFillStyle()
                    }
                );

                circle.createPath(context);
                circle.fill(context);

            };

            document.addEventListener(
                'mousemove',
                onmousemove
            );

            me.onmousemove = onmousemove;

        },

        end: function () {

            var me = this;

            var onmousemove = me.onmousemove;

            if (onmousemove) {

                document.removeEventListener(
                    'mousemove',
                    onmousemove
                );

                me.onmousemove = null;

            }
        }

    };

    return Laser;

});