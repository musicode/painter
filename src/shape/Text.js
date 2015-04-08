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

                context.save();

                context.textAlign = me.align;
                context.textBaseLine = me.baseLine;
                context.fillText(me.text, me.x, me.y);

                context.restore();

            },

            stroke: function (context) {

                var me = this;

                context.save();

                context.textAlign = me.align;
                context.textBaseLine = me.baseLine;
                context.strokeText(me.text, me.x, me.y);

                context.restore();

            }

        }
    );

});
