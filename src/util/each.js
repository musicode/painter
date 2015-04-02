/**
 * @file 遍历数组或对象
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    return function (array, fn) {

        if (Array.isArray(array)) {
            array.forEach(fn);
        }
        else {
            for (var key in array) {
                if (array.hasOwnProperty(key)) {
                    if (fn(array[key], key) === false) {
                        break;
                    }
                }
            }
        }
    };

});