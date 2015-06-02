/**
 * @file 增强 retina 屏幕的体验
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var config = require('../config');

    /**
     * 增强 retina 屏幕的体验
     *
     * @param {jQuery} canvas
     */
    return function (canvas) {

        var ratio = config.devicePixelRatio;

        var width = canvas.width();
        var height = canvas.height();

        if (ratio > 1) {
            width *= ratio;
            height *= ratio;
        }

        canvas.prop({
            width: width,
            height: height
        });

    };

});