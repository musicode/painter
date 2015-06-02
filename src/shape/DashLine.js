/**
 * @file 虚线
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
     * @property {number} options.dashLength 每条虚线的长度
     */
    return inherits(
        require('./Shape'),
        {

            name: 'DashLine',

            xPropertyList: [ 'x', 'endX', 'dashLength' ],

            yPropertyList: [ 'y', 'endY' ],

            serializablePropertyList: [
                'name', 'x', 'y', 'lineWidth', 'strokeStyle', 'fillStyle',
                'endX', 'endY', 'dashLength'
            ],

            createPathExtend: function (context) {

                var startX = me.x;
                var startY = me.y;

                var endX = me.endX;
                var endY = me.endY;

                var dy = endY - startY;
                var dx = endX - startX;

                var length = Math.floor(
                    Math.sqrt(dx * dx + dy * dy) / me.dashLength
                );

                for (var i = 0; i < length; i++) {

                    context[ i % 2 === 0 ? 'moveTo' : 'lineTo' ](

                        startX + dx * (i / length),
                        startY + dy * (i / length)

                    );

                }
            },

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

            }

        }
    );

});
