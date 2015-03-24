/**
 * @file 绘制线条
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawLine = require('../path/line');

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
     * 绘制线条
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Shape} shape
     * @return {boolean}
     */
    exports.draw =  function (context, shape) {

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

        context.beginPath();
        drawLine(context, start.x, start.y, end.x, end.y);
        context.stroke();

        return true;

    };

});