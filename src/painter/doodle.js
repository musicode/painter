/**
 * @file 绘制涂鸦
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var actionHandler = {
        move: require('../path/lines'),
        up: require('../path/doodle')
    };

    /**
     * 精简点数组
     *
     * @param {Array} points
     * @return {Array}
     */
    exports.trim = function (points) {
        return points;
    };

    /**
     * 绘制涂鸦
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Shape} shape
     * @param {string=} action
     * @return {boolean}
     */
    exports.draw = function (context, shape, action) {

        context.beginPath();

        action = action || 'up';

        var fn = actionHandler[action];

        if (fn) {
            fn(context, shape.points);
            context.stroke();
        }

        return true;

    };

});