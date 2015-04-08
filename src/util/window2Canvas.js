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
     * @param {MouseEvent} event
     */
    return function (canvas, event) {

        var pos = canvas.getBoundingClientRect();
        var scaleX = canvas.width  / pos.width;
        var scaleY = canvas.height  / pos.height;

        return {
            x: (event.clientX - pos.left) * scaleX,
            y: (event.clientY - pos.top)  * scaleY
        };

    };

});