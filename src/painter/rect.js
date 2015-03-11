/**
 * @file 绘制矩形
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawRect = require('../path/rect');

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
     * 绘制矩形
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Shape} shape
     * @return {boolean}
     */
    exports.draw = function (context, shape) {

        var points = exports.trim(shape.points);

        var start = points[0];
        var end = points[1];

        context.beginPath();
        drawRect(context, start.x, start.y, end.x - start.x, end.y - start.y);
        context.stroke();

        return true;

    };

});