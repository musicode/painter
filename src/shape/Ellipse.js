/**
 * @file 椭圆
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../function/inherits');

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {number} options.width
     * @property {number} options.height
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Ellipse',

            xProperties: [ 'x', 'width' ],

            yProperties: [ 'y', 'height' ],

            serializableProperties: [
                'id', 'number', 'name', 'x', 'y', 'lineWidth', 'strokeStyle',
                'fillStyle', 'width', 'height'
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

                me.width = Math.abs(endPoint.x - startPoint.x);
                me.height = Math.abs(endPoint.y - startPoint.y);

            },

            createPath: function (context) {

                var me = this;

                var x = me.x;
                var y = me.y;

                var width = me.width;
                var height = me.height;

                if (width > 0 && height > 0) {

                    context.beginPath();

                    if (width === height) {

                        var radius = width / 2;

                        context.moveTo(x + radius, y);
                        context.arc(x, y, radius, 0, 2 * Math.PI, true);

                    }
                    else {

                        var k = (width / 0.75) / 2;
                        var h = height / 2;

                        context.moveTo(x, y - h);
                        context.bezierCurveTo(x + k, y - h, x + k, y + h, x, y + h);
                        context.bezierCurveTo(x - k, y + h, x - k, y - h, x, y - h);

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

                var me = this;

                var width = me.width;
                var height = me.height;

                return {
                    x: me.x - width / 2,
                    y: me.y - height / 2,
                    width: width,
                    height: height
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

                return me.width > 5 && me.height > 5;

            }

        }
    );

});