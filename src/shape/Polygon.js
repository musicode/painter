/**
 * @file 多边形
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');
    var rect = require('../util/rect');

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

            getPoints: function () {

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

                return points;

            },

            getBoundaryRect: function () {

                var points = this.getPoints();

                return rect(points);

            }

        }
    );

});