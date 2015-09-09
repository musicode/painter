/**
 * @file 多边形
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../function/inherits');
    var rect = require('../function/rect');

    var distance = require('../function/distance');
    var radian = require('../function/radian');

    function getX(x, radius, angle) {
        return x + radius * Math.cos(angle);
    }

    function getY(y, radius, angle) {
        return y + radius * Math.sin(angle);
    }

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {number} options.startAngle 开始角度
     * @property {number} options.radius 半径
     * @property {number} options.sides 几边形
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Polygon',

            xProperties: [ 'x', 'radius' ],

            yProperties: [ 'y' ],

            serializableProperties: [
                'id', 'number', 'name', 'x', 'y', 'lineWidth', 'strokeStyle',
                'fillStyle', 'startAngle', 'radius', 'sides'
            ],

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

                me.startAngle = radian(startPoint, endPoint);
                me.radius = distance(startPoint, endPoint);

            },

            init: function () {

                var me = this;

                var x = me.x;
                var y = me.y;

                var radius = me.radius;

                // 360°
                var fullAngle = 2 * Math.PI;

                // 单位旋转的角度
                var unit = fullAngle / me.sides;

                var angle = me.startAngle;
                var endAngle = angle + fullAngle;

                var points = [
                    {
                        x: getX(x, radius, angle),
                        y: getY(y, radius, angle)
                    }
                ];

                while (angle <= endAngle) {

                    points.push({
                        x: getX(x, radius, angle),
                        y: getY(y, radius, angle)
                    });

                    angle += unit;

                }

                me.points = points;

            },

            createPath: function () {

                var points = this.points;

                if (points.length > 0) {

                    var point = points[0];

                    context.beginPath();

                    context.moveTo(
                        point.x,
                        point.y
                    );

                    for (var i = 1, len = points.length; i < len; i++) {

                        point = points[i];

                        context.lineTo(
                            point.x,
                            point.y
                        );
                    }

                }

            },

            /**
             * 获取图形矩形范围
             *
             * @override
             * @return {Object}
             */
            getBoundaryRect: function () {
                return rect(this.points);
            },

            /**
             * 验证图形是否符合要求
             *
             * @override
             * @return {boolean}
             */
            validate: function () {
                return this.radius > 5;
            }

        }
    );

});