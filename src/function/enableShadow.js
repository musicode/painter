/**
 * @file 开启阴影效果
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 开启阴影效果
     *
     * @param {CanvasRenderingContext2D} context
     * @param {string} color
     * @param {number} offsetX
     * @param {number} offsetY
     * @param {number} blur
     */
    return function (context, color, offsetX, offsetY, blur) {

        context.shadowColor = color;
        context.shadowOffsetX = offsetX;
        context.shadowOffsetY = offsetY;
        context.shadowBlur = blur;

    };

});