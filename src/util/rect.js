/**
 * @file 获取一堆点构成的矩形区域
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    return function (points) {

        var point = points[0];

        var minX;
        var maxX;
        var minY;
        var maxY;

        minX = maxX = point.x;
        minY = maxY = point.y;

        for (var i = 1, len = points.length, x, y; i < len; i++) {

            point = points[i];

            x = point.x;
            y = point.y;

            if (x < minX) {
                minX = x;
            }
            if (x > maxX) {
                maxX = x;
            }

            if (y < minY) {
                minY = y;
            }
            if (y > maxY) {
                maxY = y;
            }

        }

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    };

});