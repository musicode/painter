/**
 * @file 获取一堆点构成的矩形区域
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    return function (points) {

        var point = points[0];

        var x = point.x;
        var y = point.y;
        var width = 0;
        var height = 0;

        for (var i = 0, len = points.length, point; i < len; i++) {

            point = points[i];

            if (point.x < x) {
                x = point.x;
            }
            else if (point.x > x + width) {
                width = point.x - x;
            }

            if (point.y < y) {
                y = point.y;
            }
            else if (point.y > y + height) {
                height = point.y - y;
            }

        }

        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    };

});