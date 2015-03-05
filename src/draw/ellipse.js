/**
 * @file 绘制椭圆
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 绘制椭圆
     *
     * @param {CanvasRenderingContext2D} context
     * @param {number} x 椭圆左上角横坐标
     * @param {number} y 椭圆左上角纵坐标
     * @param {number} width 椭圆宽度
     * @param {number} height 椭圆高度
     * @param {string} color 线条颜色
     * @param {number} thickness 线条粗细
     */
    return function (context, x, y, width, height, color, thickness) {

        context.save();

        if (color) {
            context.strokeStyle = color;
        }

        context.lineWidth = thickness || 0.5;

        var a = width / 2;
        var b = height / 2;

        // 关键是 bezierCurveTo 中两个控制点的设置
        // 0.5 和 0.6 是两个关键系数（在本函数中为试验而得）
        var ox = 0.5 * a;
        var oy = 0.6 * b;

        context.translate(x + a, y + b);
        context.beginPath();

        // 从椭圆纵轴下端开始逆时针方向绘制
        context.moveTo(0, b);
        context.bezierCurveTo(ox, b, a, oy, a, 0);
        context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
        context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
        context.bezierCurveTo(-a, oy, -ox, b, 0, b);
        context.closePath();
        context.stroke();

        context.restore();
    };

});