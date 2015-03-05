/**
 * @file 绘制由多个点组成的线条路径
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 绘制由多个点组成的线条路径
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Array.<Object>} points 点的数组
     */
    return function (context, points) {

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

    };

});