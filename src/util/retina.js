/**
 * @file 增强 retina 屏幕的体验
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 增强 retina 屏幕的体验
     *
     * @param {HTMLElement} canvas
     */
    return function (canvas) {

        var ratio = window.devicePixelRatio;

        if (ratio > 1) {

            var style = window.getComputedStyle(canvas);

            canvas.width = ratio * parseInt(style.width, 10);
            canvas.height = ratio  * parseInt(style.height, 10);

        }

    };

});