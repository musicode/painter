/**
 * @file 相对窗口坐标转换为相对 canvas 的坐标
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 相对窗口坐标转换为相对 canvas 的坐标
     *
     * @param {HTMLElement} canvas
     * @param {number} x
     * @param {number} y
     */
    return function (canvas, x, y) {

        var pos = canvas.getBoundingClientRect();
        var scaleX = canvas.width  / pos.width;
        var scaleY = canvas.height  / pos.height;

        return {
            x: (x - pos.left) * scaleX,
            y: (y - pos.top)  * scaleY
        };

    };

});