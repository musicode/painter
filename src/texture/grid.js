/**
 * @file 网格
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 绘制网格路径
     *
     * @param {CanvasRenderingContext2D} context
     * @param {number} stepX 水平间隔
     * @param {number} stepY 垂直间隔
     */
    return function (context, stepX, stepY) {

        var canvas = context.canvas;
        var width = canvas.width;
        var height = canvas.height;

        context.beginPath();

        for (var i = stepX + 0.5; i < width; i += stepX) {
            context.moveTo(i, 0);
            context.lineTo(i, height);
        }

        for (var i = stepY + 0.5; i < height; i += stepY) {
            context.moveTo(0, i);
            context.lineTo(width, i);
        }

    };

});