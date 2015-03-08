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

        var style = window.getComputedStyle(canvas);
        var width = parseInt(style.width, 10);
        var height = parseInt(style.height, 10);

        if (ratio > 1) {
            width *= ratio;
            height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

    };

});