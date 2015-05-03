/**
 * @file 主程序
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var eventEmitter = require('./eventEmitter');
    var DrawingSurface = require('./DrawingSurface');

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

            me.drawingSurface = new DrawingSurface();

            me.clear();

        },

        addShape: function (shape) {

            var me = this;

            me.list.push(shape);

            me.drawShape(shape);

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

        drawShape: function (shape) {

            var context = this.context;
            var canvas = context.canvas;
            var width = canvas.width;
            var height = canvas.height;

            if (shape.adaptive) {
                shape.toAdaptive(false, width, height);
            }

            shape.draw(context);

            // 必须要存为自适应的版本，否则 resize 无法正确重绘
            shape.toAdaptive(true, width, height);

        },

        /**
         * 改变画布大小
         *
         * @param {number} width 显示宽度
         * @param {number} height 显示高度
         */
        resize: function (width, height) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            if (me.width !== width || me.height !== height) {

                me.width = width;
                me.height = height;

                $(canvas).css({
                    width: width,
                    height: height
                });

                retina(canvas);

                // 改变大小会清空画布，所以要重绘
                me.refresh();

            }

        },

        /**
         * 刷新画布
         */
        refresh: function () {

            var me = this;

            me.clear(true);

            $.each(
                me.list,
                function (index, shape) {
                    me.drawShape(shape);
                }
            );

            me.save();

        },

        /**
         * 清空画布
         */
        clear: function () {

            var me = this;

            me.stage(me.context);

            if (arguments[0] !== true) {

                me.list = [ ];
                me.save();

            }

        },

        save: function () {

            var me = this;
            var context = me.context;

            me.drawingSurface.save(context);

        },

        restore: function () {

            var me = this;
            var context = me.context;

            me.drawingSurface.restore(context);

        }

    };


    return Main;

});