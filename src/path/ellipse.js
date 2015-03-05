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
     * @param {number} x 椭圆左上角横坐标
     * @param {number} y 椭圆左上角纵坐标
     * @param {number} width 椭圆宽度
     * @param {number} height 椭圆高度
     */
    return function (context, x, y, width, height) {

        var k = 0.5522848;
        var a = width / 2;
        var b = height / 2;
        var ox = a * k; // 水平控制点偏移量
        var oy = b * k; // 垂直控制点偏移量

        // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
        context.moveTo(x - a, y);
        context.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
        context.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
        context.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
        context.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);

    };

});