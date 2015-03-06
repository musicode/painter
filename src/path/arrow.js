/**
 * @file 绘制箭头路径
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 绘制箭头路径
     *
     * @param {CanvasRenderingContext2D} context
     * @param {number} x 圆左上角横坐标
     * @param {number} y 圆左上角纵坐标
     * @param {number} radius 半径
     */
    return function (context, x, y, radius) {

        context.moveTo(x + radius, y);

        // 顺时针画，和 rect 保持一致
        context.arc(x, y, radius, 0, 2 * Math.PI, false);

    };

});