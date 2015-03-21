/**
 * @file 保存绘图表面
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 保存绘图表面
     *
     * @param {CanvasRenderingContext2D} context
     * @return {ImageData}
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