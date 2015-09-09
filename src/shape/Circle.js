/**
 * @file 圆
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../function/inherits');
    var distance = require('../function/distance');

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {number} options.radius
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Circle',

            xProperties: [ 'x', 'radius' ],

            yProperties: [ 'y' ],

            serializableProperties: [
                'id', 'number', 'name', 'x', 'y',
                'lineWidth', 'strokeStyle', 'fillStyle', 'radius'
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

                me.radius = distance(startPoint, endPoint);

            },

            createPath: function (context) {

                var me = this;

                var radius = me.radius;

                if (radius > 0) {

                    var x = me.x;
                    var y = me.y;

                    context.beginPath();

                    context.moveTo(x + radius, y);
                    context.arc(x, y, radius, 0, 2 * Math.PI, true);

                }

            },

            /**
             * 获取图形矩形区域
             *
             * @override
             * @return {Object}
             */
            getBoundaryRect: function () {

                var me = this;
                var radius = me.radius;

                return {
                    x: me.x - radius,
                    y: me.y - radius,
                    width: 2 * radius,
                    height: 2 * radius
                };

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