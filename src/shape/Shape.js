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
     */
    function Shape(options) {
        $.extend(this, Shape.defaultOptions, options);
        this.init();
    }

    Shape.prototype = {

        constructor: Shape,

        name: 'Shape',

        xPropertyList: [ 'x' ],

        yPropertyList: [ 'y' ],

        serializablePropertyList: [
            'name', 'x', 'y',
            'lineWidth', 'strokeStyle', 'fillStyle'
        ],

        init: function () {

            var me = this;

            /**
             * 形状全局唯一的 ID
             *
             * @type {string}
             */
            me.id = guid();

            me.initExtend();

        },

        /**
         * 更新尺寸
         *
         * @param {number} xFactor
         * @param {number} yFactor
         */
        updateSize: function (xFactor, yFactor) {

            var me = this;

            $.each(
                me.xPropertyList,
                function (index, name) {
                    if (me[name] > 0) {
                        me[name] *= xFactor;
                    }
                }
            );

            $.each(
                me.yPropertyList,
                function (index, name) {
                    if (me[name] > 0) {
                        me[name] *= yFactor;
                    }
                }
            );

            if ($.isArray(me.points)) {
                $.each(
                    me.points,
                    function (index, point) {
                        point.x *= xFactor;
                        point.y *= yFactor;
                    }
                );
            }

        },

        /**
         * 绘制图形
         *
         * @param {CanvasRenderingContext2D} context
         */
        draw: function (context) {

            var me = this;

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
         * 测试点是否在图形的矩形范围内
         *
         * @param {Object} point
         * @return {boolean}
         */
        testPoint: function (point) {

            var me = this;
            var rect = me.getBoundaryRect();

            var left = rect.x;
            var top = rect.y;
            var right = left + rect.width;
            var bottom = top + rect.height;

            var lineWidth = me.lineWidth;
            if (lineWidth > 0) {
                var half = lineWidth / 2;
                left -= half;
                top -= half;
                right += half;
                bottom += half;
            }

            return point.x >= left
                && point.x <= right
                && point.y >= top
                && point.y <= bottom;
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
         * 序列化
         */
        serialize: function () {

            var me = this;
            var result = { };

            $.each(
                me.serializablePropertyList,
                function (index, name) {
                    if (me[name] != null) {
                        result[name] = me[name];
                    }
                }
            );

            return result;

        },

        // 留给子类覆写
        initExtend: $.noop,
        createPathExtend: $.noop,
        getBoundaryRect: $.noop

    };

    Shape.defaultOptions = {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 1
    };

    return Shape;

});
