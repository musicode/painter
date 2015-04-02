/**
 * @file 箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {number} options.endX 结束点 x 坐标
     * @property {number} options.endY 结束点 y 坐标
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Arrow',

            drawPath: function (context, canvasWidth, canvasHeight) {

                var me = this;

                var startX = me.x * canvasWidth;
                var startY = me.y * canvasHeight;
                var endX = me.endX * canvasWidth;
                var endY = me.endY * canvasHeight;

                var dy = endY - startY;
                var dx = endX - startX;

                // 转换坐标
                context.save();
                context.translate(startX, startY);
                context.rotate(
                    Math.atan2(dy, dx)
                );

                // 箭头长度
                var distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                var thickness = me.lineWidth;

                // 实现尖部圆角效果的半径
                var radius = thickness * 0.5;
                // 从箭头顶部到双翼连接点的长度
                var headLength = thickness * 2.5;
                // 翼长
                var wingLength = thickness * 2;
                // 翼角度
                var wingAngle = Math.PI / 4;

                // 几个关键点

                var startX = radius;
                var startY = thickness * -0.5;

                var breakX = distance - headLength;
                var breakY = startY;

                var wingX = breakX - wingLength / Math.tan(wingAngle);
                var wingY = breakY - wingLength;

                context.moveTo(startX, startY);

                context.lineTo(breakX, breakY);
                context.lineTo(wingX, wingY);

                context.lineTo(distance, 0);

                context.lineTo(wingX, -1 * wingY);
                context.lineTo(breakX, -1 * breakY);

                context.lineTo(startX, -1 * startY);

                context.arc(startX, 0, radius, 0.5 * Math.PI, -0.5 * Math.PI, false);


                context.restore();

            }

        }
    );

});
