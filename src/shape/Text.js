/**
 * @file 文字
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');

    function drawText(shape, context, method) {

        context.font = shape.fontSize + 'px '
                     + shape.fontFamily;

        context.textAlign = shape.textAlign;
        context.textBaseline = shape.textBaseline;


        var x = shape.x;
        var y = shape.y;

        var width = 0;

        var lineCount = 0;
        var lineHeight = shape.lineHeight;

        $.each(
            shape.text.split('\n'),
            function (index, text) {

                var textWidth = context.measureText(text).width;

                if (textWidth > width) {
                    width = textWidth;
                }

                lineCount++;

                context[method](
                    text,
                    x,
                    y + index * lineHeight
                );

            }
        );

        shape.width = width;
        shape.height = lineCount * lineHeight;

    }

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {string} options.text
     * @property {string} options.fontSize
     * @property {string} options.fontFamily
     * @property {string} options.textAlign
     * @property {string} options.textBaseline
     * @property {number} options.lineHeight 单位是像素，如 18
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Text',

            xPropertyList: [ 'x', 'fontSize', 'width' ],

            yPropertyList: [ 'y', 'lineHeight', 'height' ],

            serializablePropertyList: [
                'name', 'x', 'y', 'lineWidth', 'strokeStyle',
                'fillStyle', 'text', 'fontSize', 'fontFamily',
                'lineHeight', 'textAlign', 'textBaseline'
            ],

            createPath: $.noop,

            initExtend: function () {

                var me = this;

                me.width =
                me.height = 0;

            },

            getBoundaryRect: function () {

                var me = this;

                return {
                    x: me.x,
                    y: me.y,
                    width: me.width,
                    height: me.height
                };

            },

            fillExtend: function (context) {
                drawText(this, context, 'fillText');
            },

            strokeExtend: function (context) {
                drawText(this, context, 'strokeText');
            }

        }
    );

});
