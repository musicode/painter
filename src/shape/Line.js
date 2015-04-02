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

            getPoints: function () {

                return [
                    {
                        x: me.x,
                        y: me.y
                    },
                    {
                        x: me.endX,
                        y: me.endY
                    }
                ];

            }

        }
    );

});
