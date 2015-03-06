/**
 * @file 插值曲线
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 获得距离 p1 三分之一的点
     *
     * @inner
     * @param {Object} p1
     * @param {Object} p2
     * @return {Object}
     */
    function getOneThirdPoint(p1, p2) {
        var x = (p2.x - p1.x) / 3;
        var y = (p2.y - p1.y) / 3;
        var p = {
            x: p1.x + x,
            y: p1.y + y
        };
console.log(p1, p2, p)
        return p;
    }

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
                getOneThirdPoint(points[i], points[i - 1]),
                getOneThirdPoint(points[i], points[i + 1])
            );

        }

        data.push(points.pop());

        return data;

    };

});