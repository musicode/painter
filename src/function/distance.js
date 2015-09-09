/**
 * @file 获取两点的距离
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    return function (point1, point2) {

        var dx = point2.x - point1.x;
        var dy = point2.y - point1.y;

        return Math.sqrt(
            dx * dx + dy * dy
        );

    };

});