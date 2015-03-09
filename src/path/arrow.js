/**
 * @file 绘制箭头路径
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var getPartPoint = require('../algorithm/getPartPoint');

    var ninety = Math.PI / 2;

    /**
     * 以矩形 + 三角形作为一个标准箭头
     *
     * 可在此基础上定义各种变形
     */

    /**
     * 绘制箭头路径，基于绘制的复杂性，默认以 (0,0) 为起点，水平向右
     *
     * 因此当调用此方法时，需要坐标平移和旋转
     *
     * @param {CanvasRenderingContext2D} context
     * @param {number} length 箭头长度
     * @param {number} thickness 粗细
     * @param {number} arrowWidth 底边长
     * @param {number} arrowHeight 底边高
     */
    return function (context, x1, y1, x2, y2, thickness, arrowWidth, arrowHeight, angle) {

        if (angle > 0 && angle < 90) { }
        else {
            angle = ninety;
        }

        var dy = y2 - y1;
        var dx = x2 - x1;

        // 转换坐标
        context.save();
        context.translate(x1, y1);
        context.rotate(Math.atan2(dy, dx));

        // 两点之间的距离
        var distance = Math.sqrt(
            dx * dx + dy * dy
        );

        var bottomY = thickness / 2;
        var topY = - bottomY;

        // 箭头的倾斜角度
        dy = arrowWidth / 2 - topY;
        dx = dy / Math.tan(angle);

        context.moveTo(0, topY);

        context.lineTo(distance - arrowHeight + dx, topY);
        context.lineTo(distance - arrowHeight, topY - dy);

        context.lineTo(distance, 0);

        context.lineTo(distance - arrowHeight, bottomY + dy);
        context.lineTo(distance - arrowHeight + dx, bottomY);

        context.lineTo(0, bottomY);

        context.lineTo(0, topY);

        context.restore();
    };

});