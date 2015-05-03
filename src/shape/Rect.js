/**
 * @file 矩形
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');

    /**
     * 构造函数新增参数
     *
     * @param {Object} options
     * @property {number} options.width
     * @property {number} options.height
     * @property {number=} options.roundCorner 如果是圆角矩形，可设置圆角大小
     */
    return inherits(
        require('./Shape'),
        {

            name: 'Rect',

            createPathExtend: function (context) {

                var me = this;

                var x = me.x;
                var y = me.y;
                var width = me.width;
                var height = me.height;

                var roundCorner = me.roundCorner;

                if (roundCorner > 0) {

                    context.moveTo(x + roundCorner, y);

                    context.arcTo(
                        x + width,
                        y,
                        x + width,
                        y + roundCorner,
                        roundCorner
                    );

                    context.arcTo(
                        x + width,
                        y + height,
                        x + width - roundCorner,
                        y + height,
                        roundCorner
                    );

                    context.arcTo(
                        x,
                        y + height,
                        x,
                        y + height - roundCorner,
                        roundCorner
                    );

                    context.arcTo(
                        x,
                        y,
                        x + roundCorner,
                        y,
                        roundCorner
                    );

                }
                else {
                    context.rect(x, y, width, height);
                }

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

            toAdaptiveExtend: function (adaptive, width, height) {

                var me = this;

                if (adaptive) {
                    me.width /= width;
                    me.height /= height;
                }
                else {
                    me.width *= width;
                    me.height *= height;
                }

            }

        }
    );

});
