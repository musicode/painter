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

            getBoundaryRect: function () {

                var points = this.getPoints();

                return rect(points);

            }

        }
    );

});
