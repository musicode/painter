/**
 * @file 使用激光笔
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('../style');
    var window2Canvas = require('../util/window2Canvas');
    var saveDrawingSurface = require('../util/saveDrawingSurface');
    var restoreDrawingSurface = require('../util/restoreDrawingSurface');

    var Ellipse = require('../shape/Ellipse');

    var namespace = '.painter_action_laser';

    exports.start = function (context) {

        var canvas = context.canvas;
        var drawingSurface = saveDrawingSurface(context);

        var circle = new Ellipse({
            adaptive: false
        });

        $(document).on(

            'mousemove' + namespace,

            function (e) {

                restoreDrawingSurface(context, drawingSurface);

                var point = window2Canvas(canvas, e);
                var radius = style.getLineWidth();

                $.extend(
                    circle,
                    point,
                    {
                        width: radius,
                        height: radius,
                        fillStyle: style.getFillStyle()
                    }
                );

                circle.createPath(context);
                circle.fill(context);

            }
        );

    };

    exports.end = function () {

        $(document).off(namespace);

    };

});