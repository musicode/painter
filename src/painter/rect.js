/**
 * @file 绘制矩形
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawRect = require('../path/rect');

    /**
     * 绘制矩形
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Shape} shape
     */
    return function (context, shape) {

        var points = shape.points;

        var start = points[0];
        var end = points[points.length - 1];

        var startX = Math.min(start.x, end.x);
        var startY = Math.min(start.y, end.y);
        var endX = Math.max(start.x, end.x);
        var endY = Math.max(start.y, end.y);

        context.beginPath();
        drawRect(context, startX, startY, endX - startX, endY - startY);
        context.stroke();

    };

});