/**
 * @file 涂鸦
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../function/inherits');
    var rect = require('../function/rect');

    var chaikinCurve = require('../algorithm/chaikinCurve');

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {Array} options.points 点数组
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Doodle',

            xProperties: [ 'x' ],

            yProperties: [ 'y' ],

            serializableProperties: [
                'id', 'number', 'name', 'x', 'y', 'lineWidth',
                'strokeStyle', 'fillStyle', 'points', 'smooth'
            ],

            init: function () {

                var me = this;

                var points = me.points;
                var len = points.length;

                if (!me.smooth && len > 2) {

                    // 用插值算法平滑曲线
                    for (var i = 0; i < 3; i++) {
                        points = chaikinCurve(points);
                    }

                    me.points = points;

                    me.smooth = true;

                }


            },

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

                $.each(me.points, function (index, point) {
                    point.x += dx;
                    point.y += dy;
                });

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

                me.points.push(endPoint);

            },

            /**
             *
             * @param {CanvasRenderingContext2D} context
             */
            createPath: function (context) {

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
             * 获取图形矩形区域
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
                return this.points.length > 3;
            }

        }
    );

});
