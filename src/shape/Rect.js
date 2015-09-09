/**
 * @file 矩形
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
     * @property {number=} options.roundCorner 如果是圆角矩形，可设置圆角大小
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Rect',

            xProperties: [ 'x', 'width', 'roundCorner' ],

            yProperties: [ 'y', 'height' ],

            serializableProperties: [
                'id', 'number', 'name', 'x', 'y', 'lineWidth', 'strokeStyle',
                'fillStyle', 'width', 'height', 'roundCorner'
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

                var startX = Math.min(startPoint.x, endPoint.x);
                var startY = Math.min(startPoint.y, endPoint.y);
                var endX = Math.max(startPoint.x, endPoint.x);
                var endY = Math.max(startPoint.y, endPoint.y);

                me.x = startX;
                me.y = startY;
                me.width = endX - startX;
                me.height = endY - startY;

            },

            createPath: function (context) {

                var me = this;

                var x = me.x;
                var y = me.y;
                var width = me.width;
                var height = me.height;

                context.beginPath();

                var roundCorner = me.roundCorner;

                if (roundCorner > 0) {

                    context.moveTo(x + roundCorner, y);

                    context.arcTo(
                        x + width,
                        y,
                        x + width,
                        y + roundCorner,
                        roundCorner
                    );

                    context.arcTo(
                        x + width,
                        y + height,
                        x + width - roundCorner,
                        y + height,
                        roundCorner
                    );

                    context.arcTo(
                        x,
                        y + height,
                        x,
                        y + height - roundCorner,
                        roundCorner
                    );

                    context.arcTo(
                        x,
                        y,
                        x + roundCorner,
                        y,
                        roundCorner
                    );

                }
                else {
                    context.rect(x, y, width, height);
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

                return {
                    x: me.x,
                    y: me.y,
                    width: me.width,
                    height: me.height
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
