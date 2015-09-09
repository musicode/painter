/**
 * @file hex 转成 rgb
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * hex 转成 rgb
     *
     * @param {number} hex
     * @return {number}
     */
    return function (hex) {

        var r = (hex >> 16) & 0xFF;
        var g = (hex >> 8) & 0xFF;
        var b = hex & 0xFF;

        return 'rgb(' + r + ',' + g + ',' + b + ')';

    };

});