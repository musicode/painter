/**
 * @file 绘制线条
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 绘制线条
     *
     * @param {CanvasRenderingContext2D} context
     * @param {number} x1 起点横坐标
     * @param {number} y1 起点纵坐标
     * @param {number} x2 终点横坐标
     * @param {number} y2 终点纵坐标
     * @param {string} color 线条颜色
     * @param {number} thickness 线条粗细
     */
    return function (context, x1, y1, x2, y2, color, thickness) {

        context.save();

        if (color) {
            context.strokeStyle = color;
        }

        context.lineWidth = thickness || 0.5;

        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();

        context.restore();
    };

});