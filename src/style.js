/**
 * @file 样式，全局统一从这取值
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var eventEmitter = require('./eventEmitter');

    var fontSize = 12;

    var lineWidth = 0.5;

    var fillStyle = '#333';

    var strokeStyle = '#333';


    exports.getFontSize = function () {
        return fontSize;
    };

    exports.setFontSize = function (value) {
        if (fontSize !== value) {

            fontSize = value;

            eventEmitter.trigger(
                eventEmitter.FONT_SIZE_CHANGE,
                {
                    fontSize: value
                }
            );

        }
    };

    exports.getLineWidth = function () {
        return lineWidth;
    };

    exports.setLineWidth = function (value) {
        if (lineWidth !== value) {

            lineWidth = value;

            eventEmitter.trigger(
                eventEmitter.LINE_WIDTH_CHANGE,
                {
                    lineWidth: value
                }
            );

        }
    };

    exports.getFillStyle = function () {
        return fillStyle;
    };

    exports.setFillStyle = function (value) {
        if (fillStyle !== value) {

            fillStyle = value;

            eventEmitter.trigger(
                eventEmitter.FILL_STYLE_CHANGE,
                {
                    fillStyle: value
                }
            );

        }
    };

    exports.getStrokeStyle = function () {
        return strokeStyle;
    };

    exports.setStrokeStyle = function (value) {
        if (strokeStyle !== value) {

            strokeStyle = value;

            eventEmitter.trigger(
                eventEmitter.STROKE_STYLE_CHANGE,
                {
                    strokeStyle: value
                }
            );
        }
    };

});