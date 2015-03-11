/**
 * @file 随机色
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 随机色
     *
     * @param {number} alpha 不透明度
     * @return {string}
     */
    return function (alpha) {

        var r = Math.floor(Math.random() * 255) + 1;
        var g = Math.floor(Math.random() * 255) + 1;
        var b = Math.floor(Math.random() * 255) + 1;

        return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';

    };

});