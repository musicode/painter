/**
 * @file 文字
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {string} options.text
     * @property {string} options.fontSize
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Text',

            toAdaptiveExtend: function (adaptive, canvasWidth, canvasHeight) {

                var me = this;

                if (adaptive) {
                    me.fontSize /= canvasWidth;
                }
                else {
                    me.fontSize *= canvasWidth;
                }
            },

            getBoundaryRect: function (context) {

                var me = this;

                var width = context.measureText(me.text).width;
                var height = 10;

                return {
                    x: me.x,
                    y: me.y,
                    width: width,
                    height: height
                };

            },

            fill: function (context) {

                var me = this;

                var width;
                var height;

                if (me.adaptive) {
                    var canvas = context.canvas;
                    width = canvas.width;
                    height = canvas.height;
                }
                else {
                    width = height = 1;
                }

                context.save();

                context.shadowColor = me.shadowColor;
                context.shadowOffsetX = me.shadowOffsetX;
                context.shadowOffsetY = me.shadowOffsetY;
                context.shadowBlur = me.shadowBlur;

                context.font = me.fontSize * width + 'px PingHei, "Hiragino Sans GB", "Microsoft YaHei"';
                context.textAlign = me.align;
                context.textBaseLine = me.baseLine;

                context.fillStyle = me.fillStyle;
                context.fillText(me.text, me.x * width, me.y * height);

                context.restore();

            },

            stroke: function (context) {

                var me = this;

                var width;
                var height;

                if (me.adaptive) {
                    var canvas = context.canvas;
                    width = canvas.width;
                    height = canvas.height;
                }
                else {
                    width = height = 1;
                }
                context.save();

                context.shadowColor = me.shadowColor;
                context.shadowOffsetX = me.shadowOffsetX;
                context.shadowOffsetY = me.shadowOffsetY;
                context.shadowBlur = me.shadowBlur;

                context.font = me.fontSize * width + 'px ';
                context.textAlign = me.align;
                context.textBaseLine = me.baseLine;

                context.strokeStyle = me.strokeStyle;
                context.strokeText(me.text, me.x * width, me.y * height);

                context.restore();

            }

        }
    );

});
