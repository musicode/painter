/**
 * @file 绘制涂鸦路径
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawLines = require('./lines');
    var chaikinCurve = require('../algorithm/chaikinCurve');

    /**
     * 绘制涂鸦路径
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Array.<Object>} points 点的数组
     */
    return function (context, points) {

        var len = points.length;

        if (len > 2) {
            for (var i = 0; i < 3; i++) {
                points = chaikinCurve(points);
            }
        }

        drawLines(context, points);

    };

});