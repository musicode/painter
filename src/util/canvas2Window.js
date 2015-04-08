/**
 * @file 相对 canvas 的坐标转换为相对窗口坐标
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 相对 canvas 的坐标转换为相对窗口坐标
     *
     * @param {HTMLElement} canvas
     * @param {Object} point
     */
    return function (canvas, point) {

        var pos = canvas.getBoundingClientRect();
        var scaleX = canvas.width  / pos.width;
        var scaleY = canvas.height  / pos.height;

        return {
            x: point.x / scaleY + pos.left,
            y: point.y / scaleY + pos.top
        };

    };

});