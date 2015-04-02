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

            drawPath: function (context, canvasWidth, canvasHeight) {

                var x1 = me.x * canvasWidth;
                var y1 = me.y * canvasHeight;

                var x2 = me.endX * canvasWidth;
                var y2 = me.endY * canvasHeight;

                var dy = y2 - y1;
                var dx = x2 - x1;

                var length = Math.floor(
                    Math.sqrt(dx * dx + dy * dy) / me.dashLength
                );

                for (var i = 0; i < length; i++) {

                    context[ i % 2 === 0 ? 'moveTo' : 'lineTo' ](

                        x1 + dx * (i / length),
                        y1 + dy * (i / length)

                    );

                }
            }

        }
    );

});
