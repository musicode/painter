/**
 * @file 点
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../function/inherits');

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {number} options.radius
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Point',

            xProperties: [ 'x' ],

            yProperties: [ 'y' ],

            serializableProperties: [
                'id', 'number', 'name', 'x', 'y'
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

                me.x = endPoint.x;
                me.y = endPoint.y;

            }

        }
    );

});