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
     * 绘制涂鸦
     *
     * @param {CanvasRenderingContext2D} context
     * @param {Shape} shape
     */
    return function (context, shape, action) {

        context.beginPath();

        var fn = actionHandler[action];
        if (fn) {
            fn(context, shape.points);
        }

        context.stroke();

    };

});