/**
 * @file 绘制由多个点组成的线条
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 绘制由多个点组成的线条
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Array.<Object>} points 点的数组
     * @param {string} color 线条颜色
     * @param {number} thickness 线条粗细
     */
    return function (context, points, color, thickness) {

        context.save();

        if (color) {
            context.strokeStyle = color;
        }

        context.lineWidth = thickness || 0.5;

        context.beginPath();

        for (var i = 0, len = points.length; i < len; i++) {
            context.lineTo(
                points[i].x,
                points[i].y
            );
        }

        context.stroke();

        context.restore();
    };

});