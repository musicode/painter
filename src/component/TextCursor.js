/**
 * @file 模拟文本框光标
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     *
     * @param {Object} options
     * @property {number} options.width
     * @property {string} options.fillStyle
     */
    function TextCursor(options) {
        $.extend(this, options);
    }

    TextCursor.prototype = {

        constructor: TextCursor,

        getHeight: function (context) {

            // measureText 不会返回 height
            // 对大多数字型来说，字母 W 的宽度再稍微加一点，就可以得出近似值了
            var height = context.measureText('W').width;

            return 1.6 * height;

        },

        createPath: function (context, x, y) {

            var me = this;

            context.beginPath();
            context.rect(
                x,
                y,
                me.width,
                me.getHeight(context)
            );

        },

        draw: function (context, x, y) {

            context.save();

            var me = this;

            me.x = x;
            me.y = y;

            me.createPath(context, x, y);

            context.fillStyle = me.fillStyle;
            context.fill();

            context.restore();

        },

        /**
         * 擦除光标
         *
         * @param {CanvasRenderingContext2D} context
         * @param {ImageData} imageData
         */
        erase: function (context, imageData) {

            var me = this;

            context.putImageData(
                imageData, 0, 0,
                me.x, me.y, me.width, me.getHeight(context)
            );

        },

        /**
         * 绘制闪动的光标
         *
         * @param {number}
         */
        blink: function (context, x, y) {

            var me = this;

            me.draw();

            setTimeout(
                function () {
                    me.erase();
                },
                500
            );

        }

    };

    TextCursor.defaultOptions = {
        width: 4,
        fillStyle: 'rgba(0,0,0,0.5)'
    };

    return TextCursor;

});