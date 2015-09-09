/**
 * @file 样式，全局统一从这取值
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var fontSize = 20;

    var fontFamily = 'PingHei, "Hiragino Sans GB", "Microsoft YaHei"';

    var lineWidth = 1;

    var fillStyle = '#333';

    var strokeStyle = '#333';


    exports.getFontSize = function () {
        return fontSize;
    };

    exports.setFontSize = function (value) {
        if (fontSize !== value) {
            fontSize = value;
        }
    };


    exports.getFontFamily = function () {
        return fontFamily;
    };

    exports.setFontFamily = function (value) {
        if (fontFamily !== value) {
            fontFamily = value;
        }
    };



    exports.getLineWidth = function () {
        return lineWidth;
    };

    exports.setLineWidth = function (value) {
        if (lineWidth !== value) {
            lineWidth = value;
        }
    };



    exports.getFillStyle = function () {
        return fillStyle;
    };

    exports.setFillStyle = function (value) {
        if (fillStyle !== value) {
            fillStyle = value;
        }
    };



    exports.getStrokeStyle = function () {
        return strokeStyle;
    };

    exports.setStrokeStyle = function (value) {
        if (strokeStyle !== value) {
            strokeStyle = value;
        }
    };



});