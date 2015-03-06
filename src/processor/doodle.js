/**
 * @file 通过点数组绘制涂鸦
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var actionHandler = {
        move: require('../path/lines'),
        up: require('../path/doodle')
    };

    /**
     * 通过点数组绘制涂鸦
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Array.<Object>} points
     */
    return function (context, points, action) {

        actionHandler[action](context, points);

    };

});