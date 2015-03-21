/**
 * @file 恢复绘图表面
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 恢复绘图表面
     *
     * @param {CanvasRenderingContext2D} context
     * @param {ImageData} imageData
     */
    return function (context, imageData) {
        context.putImageData(imageData, 0, 0);
    };

});