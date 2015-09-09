/**
 * @file 关闭阴影效果
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 关闭阴影效果
     *
     * @param {CanvasRenderingContext2D} context
     */
    return function (context) {

        context.shadowColor = undefined;
        context.shadowOffsetX =
        context.shadowOffsetY =
        context.shadowBlur = 0;

    };

});