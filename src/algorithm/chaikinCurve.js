/**
 * @file 插值曲线
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var getPartPoint = require('./getPartPoint');

    /**
     * 插值曲线
     *
     * @param {Array.<Object>} points
     * @return {Array.<Object>}
     */
    return function (points) {

        var data = [ points[0] ];

        // 处理第二个至倒数第二个点
        for (var i = 1, len = points.length - 1; i < len; i++) {

            data.push(
                getPartPoint(points[i], points[i - 1], 3),
                getPartPoint(points[i], points[i + 1], 3)
            );

        }

        data.push(points.pop());

        return data;

    };

});