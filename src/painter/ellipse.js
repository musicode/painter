/**
 * @file 通过点数组绘制椭圆
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawEllipse = require('../path/ellipse');

    /**
     * 通过点数组绘制椭圆
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Array.<Object>} points
     */
    return function (context, points) {

        var start = points[0];
        var end = points[points.length - 1];

        var startX = Math.min(start.x, end.x);
        var startY = Math.min(start.y, end.y);
        var endX = Math.max(start.x, end.x);
        var endY = Math.max(start.y, end.y);

        var width = endX - startX;
        var height = endY - startY;

        context.beginPath();

        drawEllipse(
            context,
            startX + width / 2,
            startY + height / 2,
            width,
            height
        );

        context.stroke();

    };

});