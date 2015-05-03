/**
 * @file 涂鸦
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');
    var rect = require('../util/rect');

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {Array} options.points 点数组
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Doodle',

            /**
             * createPath 的扩展，方便子类覆写
             *
             * @param {CanvasRenderingContext2D} context
             */
            createPathExtend: function (context) {

                var points = this.points;

                if (points.length > 0) {

                    var point = points[0];

                    context.moveTo(
                        point.x,
                        point.y
                    );

                    for (var i = 1, len = points.length; i < len; i++) {

                        point = points[i];

                        context.lineTo(
                            point.x,
                            point.y
                        );
                    }

                }

            },

            getBoundaryRect: function () {

                return rect(this.points);

            },

            toAdaptiveExtend: function (adaptive, width, height) {

                var fn;

                if (adaptive) {
                    fn = function (index, point) {
                        point.x /= width;
                        point.y /= height;
                    };
                }
                else {
                    fn = function (index, point) {
                        point.x *= width;
                        point.y *= height;
                    };
                }

                $.each(
                    this.points,
                    fn
                );

            }

        }
    );

});
