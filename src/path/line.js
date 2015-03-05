/**
 * @file 绘制线条路径
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 绘制线条路径
     *
     * @param {CanvasRenderingContext2D} context
     * @param {number} x1 起点横坐标
     * @param {number} y1 起点纵坐标
     * @param {number} x2 终点横坐标
     * @param {number} y2 终点纵坐标
     */
    return function (context, x1, y1, x2, y2) {

        context.moveTo(x1, y1);
        context.lineTo(x2, y2);

    };

});