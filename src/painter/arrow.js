/**
 * @file 通过点数组绘制箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawArrow = require('../path/arrow');

    /**
     * 通过点数组绘制箭头
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Array.<Object>} points
     */
    return function (context, points) {

        var start = points[0];
        var end = points[points.length - 1];

        context.beginPath();
        drawArrow(context, start.x, start.y, end.x, end.y, context.lineWidth * 10, 60, 80, 60 * Math.PI / 180);
        context.fill();

    };

});