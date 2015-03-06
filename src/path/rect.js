/**
 * @file 绘制矩形路径
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 绘制矩形路径
     *
     * @param {CanvasRenderingContext2D} context
     * @param {number} x 左上角横坐标
     * @param {number} y 左上角纵坐标
     * @param {number} width 宽度
     * @param {number} height 高度
     */
    return function (context, x, y, width, height) {

        context.rect(x, y, width, height);

    };

});