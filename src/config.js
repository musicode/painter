/**
 * @file 配置项
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 设备像素比
     *
     * @type {number}
     */
    exports.devicePixelRatio = typeof window.devicePixelRatio !== 'undefined'
                             ? window.devicePixelRatio
                             : 1;

    /**
     * 自定义指针的选择器
     *
     * @type {string}
     */
    exports.customCursorSelector = '.custom-cursor';

});