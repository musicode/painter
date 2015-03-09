/**
 * @file 画布快照
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 画布快照
     *
     * @param {CanvasRenderingContext2D} context
     */
    return function (context) {

        var canvas = context.canvas;

        return context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

    };

});