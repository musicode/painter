/**
 * @file 绘制箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawArrow = require('../path/arrow');

    /**
     * 绘制箭头
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Shape} shape
     */
    return function (context, shape) {

        var points = shape.points;

        var start = points[0];
        var end = points[points.length - 1];
        var lineWidth = context.lineWidth;

        context.beginPath();

        drawArrow(
            context,
            start.x,
            start.y,
            end.x,
            end.y,
            lineWidth + 20,
            lineWidth + 30,
            lineWidth + 50,
            60 * Math.PI / 180
        );

        context.fill();

    };

});