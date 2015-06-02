/**
 * @file 主程序
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var eventEmitter = require('./eventEmitter');
    var DrawingSurface = require('./DrawingSurface');
    var config = require('./config');

    var retina = require('./util/retina');

    /**
     * @param {Object} options
     * @property {CanvasRenderingContext2D} options.context
     * @property {Function} options.stage 初始化舞台，clear 也会调此函数
     */
    function Main(options) {
        $.extend(this, options);
        this.init();
    }

    Main.prototype = {

        constructor: Main,

        init: function () {

            var me = this;

            /**
             * 图形列表
             *
             * @type {Array}
             */
            me.list = [ ];

            var canvas = me.context.canvas;

            /**
             * 画布的宽度
             *
             * @type {number}
             */
            me.width = canvas.width;

            /**
             * 画布的高度
             *
             * @type {number}
             */
            me.height = canvas.height;

            /**
             * 绘图表面
             *
             * @type {DrawingSurface}
             */
            me.drawingSurface = new DrawingSurface();

            me.clear();

        },

        addShape: function (shape) {

            var me = this;

            me.list.push(shape);

            shape.draw(me.context);

            me.save();

            eventEmitter.trigger(
                eventEmitter.SHAPE_ADD,
                {
                    shape: shape
                }
            );

        },

        removeShape: function (shapeId) {

            var me = this;
            var list = me.list;

            // 要删除的 shape 索引
            var index;

            $.each(
                list,
                function (i, shape) {
                    if (shape.id === shapeId) {
                        index = i;
                        return false;
                    }
                }
            );

            if (index >= 0) {

                var shape = list[ index ];

                list.splice(index, 1);

                me.refresh();

                eventEmitter.trigger(
                    eventEmitter.SHAPE_REMOVE,
                    {
                        shape: shape
                    }
                );

            }

        },

        /**
         * 改变画布大小
         *
         * @param {number} viewWidth 显示宽度
         * @param {number} viewHeight 显示高度
         */
        resize: function (viewWidth, viewHeight) {

            if (!viewWidth && !viewHeight) {
                return;
            }

            var me = this;

            var oldWidth = me.width;
            var oldHeight = me.height;

            var devicePixelRatio = config.devicePixelRatio;

            var newWidth = viewWidth * devicePixelRatio;
            var newHeight = viewHeight * devicePixelRatio;

            if (oldWidth !== newWidth || oldHeight !== newHeight) {

                var canvas = me.getCanvas();

                canvas.css({
                    width: viewWidth,
                    height: viewHeight
                });

                retina(canvas);

                me.width = newWidth;
                me.height = newHeight;

                // x 坐标转换因数
                var xFactor = oldWidth > 0
                            ? (newWidth / oldWidth)
                            : 0;

                // y 坐标转换因数
                var yFactor = oldHeight > 0
                            ? (newHeight / oldHeight)
                            : 0;

                // 改变大小会清空画布，所以要重绘
                me.refresh(xFactor, yFactor);

            }

        },

        /**
         * 刷新画布
         */
        refresh: function (xFactor, yFactor) {

            var me = this;

            me.clear(true);

            $.each(
                me.list,
                function (index, shape) {

                    if (xFactor > 0 && yFactor > 0) {
                        shape.updateSize(xFactor, yFactor);
                    }

                    shape.draw(me.context);

                }
            );

            me.save();

        },

        /**
         * 获取 canvas 元素（jQuery对象）
         *
         * @return {jQuery}
         */
        getCanvas: function () {
            return $(this.context.canvas);
        },

        /**
         * 清空画布
         */
        clear: function () {

            var me = this;

            me.stage(me.context);

            if (arguments[0] !== true) {

                me.list.length = 0;
                me.save();

                eventEmitter.trigger(
                    eventEmitter.SHAPE_CLEAR
                );

            }

        },

        save: function () {

            var me = this;

            me.drawingSurface.save(me);

        },

        restore: function () {

            var me = this;

            me.drawingSurface.restore(me);

        }

    };


    return Main;

});