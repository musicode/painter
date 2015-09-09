/**
 * @file 箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../function/inherits');
    var lines = require('../function/lines');
    var rect = require('../function/rect');

    var getDistance = require('../function/distance');
    var getRadian = require('../function/radian');

    function restorePoint(point, offsetX, offsetY, radian) {

        var x = point.x;
        var y = point.y;

        var pointRadian = Math.atan2(y, x);

        pointRadian += radian;

        var length = Math.sqrt(
            x * x + y * y
        );

        point.x = offsetX + Math.cos(pointRadian) * length;
        point.y = offsetY + Math.sin(pointRadian) * length;

        return point;

    }

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {number} options.thickness 箭头粗细
     * @property {number} options.endX 结束点 x 坐标
     * @property {number} options.endY 结束点 y 坐标
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Arrow',

            xProperties: [ 'x', 'endX', 'thickness' ],

            yProperties: [ 'y', 'endY' ],

            serializableProperties: [
                'id', 'number', 'name', 'x', 'y',
                'lineWidth', 'strokeStyle', 'fillStyle',
                'endX', 'endY', 'thickness'
            ],

            /**
             * 平移
             *
             * @param {number} dx
             * @param {number} dy
             */
            translate: function (dx, dy) {

                var me = this;

                me.x += dx;
                me.y += dy;

                me.endX += dx;
                me.endY += dy;

            },

            /**
             * 通过开始结束点更新图形
             *
             * @override
             * @param {Object} startPoint
             * @param {Object} endPoint
             */
            updatePoint: function (startPoint, endPoint) {

                var me = this;

                me.x = startPoint.x;
                me.y = startPoint.y;

                me.endX = endPoint.x;
                me.endY = endPoint.y;

            },

            createPath: function (context) {

                var me = this;

                var startX = me.x;
                var startY = me.y;
                var endX = me.endX;
                var endY = me.endY;

                var startPoint = {
                    x: startX,
                    y: startY
                };
                var endPoint = {
                    x: endX,
                    y: endY
                };

                // 箭头长度
                var distance = getDistance(startPoint, endPoint);
                var rotateRadian = getRadian(startPoint, endPoint);

                var translateX = startX;
                var translateY = startY;

                context.beginPath();
                context.save();

                // 转换坐标
                context.translate(translateX, translateY);
                context.rotate(rotateRadian);

                // 计算关键坐标点
                var thickness = me.thickness;

                // 实现尖部圆角效果的半径
                var radius = thickness * 0.5;
                // 从箭头顶部到双翼连接点的长度
                var headLength = thickness * 2.5;
                // 翼长
                var wingLength = thickness * 2;
                // 翼角度
                var wingAngle = Math.PI / 4;

                var arcX = radius;
                var arcY = thickness * 0.5;

                var breakX = distance - headLength;
                var breakY = arcY;

                var wingX = breakX - wingLength / Math.tan(wingAngle);
                var wingY = breakY + wingLength;

                var headPoint = {
                    x: distance,
                    y: 0
                };

                var topWingPoint = {
                    x: wingX,
                    y: -1 * wingY
                };

                var bottomWingPoint = {
                    x: wingX,
                    y: wingY
                };

                var topBreakPoint = {
                    x: breakX,
                    y: -1 * breakY
                };

                var bottomBreakPoint = {
                    x: breakX,
                    y: breakY
                };

                var topStartPoint = {
                    x: arcX,
                    y: -1 * arcY
                };

                var bottomStartPoint = {
                    x: arcX,
                    y: arcY
                };

                lines(
                    context,
                    [
                        topStartPoint,
                        topBreakPoint,
                        topWingPoint,
                        headPoint,
                        bottomWingPoint,
                        bottomBreakPoint,
                        bottomStartPoint
                    ]
                );

                context.arc(arcX, 0, radius, 0.5 * Math.PI, -0.5 * Math.PI, false);

                context.restore();

                me.rectPoints = [
                    { x: startX, y: startY },
                    { x: endX, y: endY },
                    restorePoint(topWingPoint, translateX, translateY, rotateRadian),
                    restorePoint(bottomWingPoint, translateX, translateY, rotateRadian)
                ];

            },


            /**
             * 获取图形矩形区域
             *
             * @override
             * @return {Object}
             */
            getBoundaryRect: function () {
                return rect(this.rectPoints);
            },

            /**
             * 验证图形是否符合要求
             *
             * @override
             * @return {boolean}
             */
            validate: function () {
                var me = this;
                return $.type(me.endX) === 'number'
                    && $.type(me.endY) === 'number';
            }

        }
    );

});
