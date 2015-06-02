/**
 * @file 线条
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

            name: 'Line',

            xPropertyList: [ 'x', 'endX' ],

            yPropertyList: [ 'y', 'endY' ],

            serializablePropertyList: [
                'name', 'x', 'y', 'lineWidth',
                'strokeStyle', 'fillStyle', 'endX', 'endY'
            ],

            createPathExtend: function (context) {

                var me = this;

                context.moveTo(me.x, me.y);
                context.lineTo(me.endX, me.endY);

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
