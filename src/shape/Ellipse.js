/**
 * @file 椭圆
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');

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

            xPropertyList: [ 'x', 'width' ],

            yPropertyList: [ 'y', 'height' ],

            serializablePropertyList: [
                'name', 'x', 'y', 'lineWidth', 'strokeStyle',
                'fillStyle', 'width', 'height'
            ],

            createPathExtend: function (context) {

                var me = this;

                var x = me.x;
                var y = me.y;
                var width = me.width;
                var height = me.height;

                if (width > 0 && height > 0) {

                    if (width === height) {

                        var radius = width / 2;

                        context.moveTo(x + radius, y);
                        context.arc(x, y, radius, 0, 2 * Math.PI, true);

                    }
                    else {

                        var k = (width / 0.75 ) / 2;
                        var w = width / 2;
                        var h = height / 2;

                        context.moveTo(x, y - h);
                        context.bezierCurveTo(x + k, y - h, x + k, y + h, x, y + h);
                        context.bezierCurveTo(x - k, y + h, x - k, y - h, x, y - h);

                    }
                }

            },

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

            }

        }
    );

});