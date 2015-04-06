/**
 * @file 样式，全局统一从这取值
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var lineWidth = 0.5;

    var fillStyle = '#333';

    var strokeStyle = '#333';


    exports.getLineWidth = function () {
        return lineWidth;
    };

    exports.setLineWidth = function (value) {
        lineWidth = value;
    };

    exports.getFillStyle = function () {
        return fillStyle;
    };

    exports.setFillStyle = function (value) {
        fillStyle = value;
    };

    exports.getStrokeStyle = function () {
        return strokeStyle;
    };

    exports.setStrokeStyle = function (value) {
        strokeStyle = value;
    };

});