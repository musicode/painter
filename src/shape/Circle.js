/**
 * @file 圆
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');

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

            xPropertyList: [ 'x', 'radius' ],

            yPropertyList: [ 'y' ],

            serializablePropertyList: [
                'name', 'x', 'y', 'lineWidth',
                'strokeStyle', 'fillStyle', 'radius'
            ],

            createPathExtend: function (context) {

                var me = this;

                var radius = me.radius;

                if (radius > 0) {

                    var x = me.x;
                    var y = me.y;

                    context.moveTo(x + radius, y);
                    context.arc(x, y, radius, 0, 2 * Math.PI, true);

                }

            },

            getBoundaryRect: function () {

                var me = this;
                var radius = me.radius;

                return {
                    x: me.x - radius,
                    y: me.y - radius,
                    width: 2 * radius,
                    height: 2 * radius
                };

            }

        }
    );

});