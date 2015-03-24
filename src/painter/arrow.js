/**
 * @file 绘制箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawArrow = require('../path/arrow');

    var zoomIn = require('../util/zoomIn');

    /**
     * 精简点数组
     *
     * @param {Array} points
     * @return {Array}
     */
    exports.trim = function (points) {
        return [
            points[0],
            points[points.length - 1]
        ];
    };

    /**
     * 绘制箭头
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Shape} shape
     * @return {boolean}
     */
    exports.draw = function (context, shape) {

        var points = shape.points;

        var canvas = context.canvas;

        var start = zoomIn(
            points[0],
            canvas.width,
            canvas.height
        );

        var end = zoomIn(
            points[points.length - 1],
            canvas.width,
            canvas.height
        );

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

        return true;

    };

});