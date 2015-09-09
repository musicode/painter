/**
 * @file 线条
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../function/inherits');

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

            name: 'Line',

            xProperties: [ 'x', 'endX' ],

            yProperties: [ 'y', 'endY' ],

            serializableProperties: [
                'id', 'number', 'name', 'x', 'y', 'lineWidth',
                'strokeStyle', 'fillStyle', 'endX', 'endY'
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

                context.beginPath();
                context.moveTo(me.x, me.y);
                context.lineTo(me.endX, me.endY);

            },

            /**
             * 获取图形矩形范围
             *
             * @override
             * @return {Object}
             */
            getBoundaryRect: function () {

                var me = this;

                var startX = Math.min(me.x, me.endX);
                var startY = Math.min(me.y, me.endY);

                var endX = Math.max(me.x, me.endX);
                var endY = Math.max(me.y, me.endY);

                return {
                    x: startX,
                    y: startY,
                    width: endX - startX,
                    height: endY - startY
                };

            },

            /**
             * 验证图形是否符合要求
             *
             * @override
             * @return {boolean}
             */
            validate: function () {

                var me = this;

                var startPoint = {
                    x: me.x,
                    y: me.y
                };

                var endPoint = {
                    x: me.endX,
                    y: me.endY
                };

                return distance(startPoint, endPoint) > 5;

            }

        }
    );

});
