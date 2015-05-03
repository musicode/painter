/**
 * @file 文字
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');

    var devicePixelRatio = window.devicePixelRatio || 1;

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {string} options.text
     * @property {string} options.fontSize
     * @property {string} options.fontFamily
     * @property {string} options.textAlign
     * @property {string} options.textBaseLine
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Text',

            createPath: $.noop,

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

            toAdaptiveExtend: function (adaptive, width) {

                var me = this;

                if (adaptive) {
                    me.fontSize /= width;
                }
                else {
                    me.fontSize *= width;
                }
            },

            fillExtend: function (context) {

                var me = this;

                context.font = me.fontSize * devicePixelRatio + 'px '
                             + me.fontFamily;
                context.textAlign = me.textAlign;
                context.textBaseLine = me.textBaseLine;
console.log(me.x, me.y)
                context.fillText(me.text, me.x, me.y);

            },

            strokeExtend: function (context) {

                var me = this;

                context.font = me.fontSize * devicePixelRatio + 'px '
                             + me.fontFamily;
                context.textAlign = me.textAlign;
                context.textBaseLine = me.textBaseLine;

                context.strokeText(me.text, me.x, me.y);

            }

        }
    );

});
