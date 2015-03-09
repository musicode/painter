/**
 * @file 复制属性
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    return function (dest, source) {

        for (var i = 1, len = arguments.length, item; i < len; i++) {

            item = arguments[i];

            for (var key in item) {
                if (item.hasOwnProperty(key)) {
                    dest[key] = item[key];
                }
            }
        }

        return dest;

    };

});