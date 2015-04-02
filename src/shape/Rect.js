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

            drawPath: function (context, canvasWidth, canvasHeight) {

                var me = this;

                var x = me.x * canvasWidth;
                var y = me.y * canvasHeight;
                var width = me.width * canvasWidth;
                var height = me.height * canvasHeight;

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

            }

        }
    );

});
