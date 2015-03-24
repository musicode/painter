/**
 * @file 绘制椭圆
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawEllipse = require('../path/ellipse');

    var zoomIn = require('../util/zoomIn');

    /**
     * 精简点数组
     *
     * @param {Array} points
     * @return {Array}
     */
    exports.trim = function (points) {

        var start = points[0];
        var end = points[points.length - 1];

        var startX = Math.min(start.x, end.x);
        var startY = Math.min(start.y, end.y);
        var endX = Math.max(start.x, end.x);
        var endY = Math.max(start.y, end.y);

        return [
            { x: startX, y: startY },
            { x: endX, y: endY }
        ];
    };

    /**
     * 绘制椭圆
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Shape} shape
     * @return {boolean}
     */
    exports.draw = function (context, shape) {

        var points = exports.trim(shape.points);

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

        var width = end.x - start.x;
        var height = end.y - start.y;

        context.beginPath();

        drawEllipse(
            context,
            start.x + width / 2,
            start.y + height / 2,
            width,
            height
        );

        context.stroke();

        return true;

    };

});