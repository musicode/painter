/**
 * @file 获得两点之间 x 分之一的点
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 获得距离 p1 x 分之一的点
     *
     * @param {Object} p1
     * @param {Object} p2
     * @param {number} part
     * @return {Object}
     */
    return function (p1, p2, part) {

        var x = (p2.x - p1.x) / part;
        var y = (p2.y - p1.y) / part;

        return {
            x: p1.x + x,
            y: p1.y + y
        };
    };

});