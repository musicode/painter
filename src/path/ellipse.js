/**
 * @file 绘制椭圆路径
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 绘制椭圆路径
     *
     * @param {CanvasRenderingContext2D} context
     * @param {number} x 椭圆中心横坐标
     * @param {number} y 椭圆中心纵坐标
     * @param {number} width 椭圆宽度
     * @param {number} height 椭圆高度
     */
    return function (context, x, y, width, height) {

        var k = (width / 0.75 ) / 2;
        var w = width / 2;
        var h = height / 2;

        context.moveTo(x, y - h);
        context.bezierCurveTo(x + k, y - h, x + k, y + h, x, y + h);
        context.bezierCurveTo(x - k, y + h, x - k, y - h, x, y - h);

    };

});