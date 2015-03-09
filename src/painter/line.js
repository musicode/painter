/**
 * @file 绘制线条
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawLine = require('../path/line');

    /**
     * 绘制线条
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Shape} shape
     */
    return function (context, shape) {

        var points = shape.points;

        var start = points[0];
        var end = points[points.length - 1];

        context.beginPath();
        drawLine(context, start.x, start.y, end.x, end.y);
        context.stroke();

    };

});