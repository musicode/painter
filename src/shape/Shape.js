/**
 * @file 图形基类
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var guid = require('../util/guid');

    var enableShadow = require('../util/enableShadow');
    var disableShadow = require('../util/disableShadow');

    /**
     * @param {Object} options
     * @property {number} options.x
     * @property {number} options.y
     * @property {string} options.strokeStyle
     * @property {string} options.fillStyle
     * @property {number} options.lineWidth
     * @property {string=} options.shadowColor
     * @property {number=} options.shadowOffsetX
     * @property {number=} options.shadowOffsetY
     * @property {number=} options.shadowBlur
     * @property {boolean} options.adaptive 是否自适应，默认是 false
     */
    function Shape(options) {
        $.extend(this, Shape.defaultOptions, options);
        this.init();
    }

    Shape.prototype = {

        constructor: Shape,

        name: 'Shape',

        init: function () {

            /**
             * 形状全局唯一的 ID
             *
             * @type {string}
             */
            this.id = guid();

        },

        /**
         * 绘制图形
         *
         * @param {CanvasRenderingContext2D} context
         */
        draw: function (context) {

            var me = this;

            if (me.adaptive) {
                throw new Error('shape must be un-adaptive');
            }

            me.createPath(context);

            if (me.lineWidth > 0) {
                me.stroke(context);
            }

            if (me.fillStyle) {
                me.fill(context);
            }

        },

        /**
         * 创建绘制路径
         *
         * @param {CanvasRenderingContext2D} context
         */
        createPath: function (context) {

            context.beginPath();

            this.createPathExtend(context);

        },

        /**
         * 创建边界路径
         *
         * @param {CanvasRenderingContext2D} context
         */
        createBoundaryPath: function (context) {

            var rect = this.getBoundaryRect(context);

            context.beginPath();

            context.rect(
                rect.x,
                rect.y,
                rect.width,
                rect.height
            );

        },

        /**
         * 点是否是否在路径中
         *
         * @param {CanvasRenderingContext2D} context
         * @param {Object} point
         * @return {boolean}
         */
        isPointInPath: function (context, point) {
            this.createPath(context);
            return context.isPointInPath(point.x, point.y);
        },

        /**
         * 描边
         *
         * @param {CanvasRenderingContext2D} context
         */
        stroke: function (context) {

            var me = this;

            context.save();

            if (me.shadowColor == null) {
                disableShadow(context);
            }
            else {
                enableShadow(
                    context,
                    me.shadowColor,
                    me.shadowOffsetX,
                    me.shadowOffsetY,
                    me.shadowBlur
                );
            }

            context.lineWidth = me.lineWidth;
            context.strokeStyle = me.strokeStyle;

            if (me.strokeExtend) {
                me.strokeExtend(context);
            }
            else {
                context.stroke();
            }

            context.restore();

        },

        /**
         * 填充
         *
         * @param {CanvasRenderingContext2D} context
         */
        fill: function (context) {

            var me = this;

            context.save();

            if (me.shadowColor == null) {
                disableShadow(context);
            }
            else {
                enableShadow(
                    context,
                    me.shadowColor,
                    me.shadowOffsetX,
                    me.shadowOffsetY,
                    me.shadowBlur
                );
            }

            context.fillStyle = me.fillStyle;

            if (me.fillExtend) {
                me.fillExtend(context);
            }
            else {
                context.fill();
            }

            context.restore();

        },

        /**
         * 把非自适应的 Shape 改为自适应
         *
         * @param {boolean} adaptive 是否自适应
         * @param {number} width 画布宽度
         * @param {number} height 画布高度
         */
        toAdaptive: function (adaptive, width, height) {

            var me = this;

            if (me.adaptive === adaptive) {
                return;
            }

            me.adaptive = adaptive;

            if (adaptive) {
                me.x /= width;
                me.y /= height;
            }
            else {
                me.x *= width;
                me.y *= height;
            }

            me.toAdaptiveExtend(adaptive, width, height);

        },

        clone: function () {

            var me = this;

            var Class = me.constructor;
            var instance = new Class();

            $.extend(instance, me);

            return instance;

        },

        // 留给子类覆写
        createPathExtend: $.noop,
        toAdaptiveExtend: $.noop,
        getBoundaryRect: $.noop

    };

    Shape.defaultOptions = {
        adaptive: false
    };


    return Shape;

});
