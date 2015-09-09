/**
 * @file 图形基类
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var guid = require('../function/guid');

    var enableShadow = require('../function/enableShadow');
    var disableShadow = require('../function/disableShadow');

    /**
     * @param {Object} options
     * @property {number} options.x
     * @property {number} options.y
     * @property {string} options.strokeStyle 描边样式
     * @property {string} options.fillStyle 填充样式
     * @property {number} options.lineWidth 线条粗细
     * @property {string=} options.shadowColor 阴影色
     * @property {number=} options.shadowOffsetX 阴影水平偏移量
     * @property {number=} options.shadowOffsetY 阴影垂直偏移量
     * @property {number=} options.shadowBlur 阴影模糊值
     */
    function Shape(options) {

        var me = this;

        $.extend(me, Shape.defaultOptions, options);

        /**
         * 本地唯一的编号，当和服务器产生交互时，这个字段很有用
         *
         * @type {string}
         */
        if (me.number == null) {
            me.number = guid();
        }

        me.init();

    }

    Shape.prototype = {

        constructor: Shape,

        init: $.noop,

        /**
         * 平移
         *
         * @param {number} dx
         * @param {number} dy
         */
        translate: function (dx, dy) {

            var me = this;

            me.x += dx;
            me.y += dy;

        },

        /**
         * 缩放
         *
         * @param {number} sx
         * @param {number} sy
         */
        scale: function (sx, sy) {

            if (sx < 1 || sx > 1) { }
            else {
                sx = 1;
            }

            if (sy < 1 || sy > 1) { }
            else {
                sy = 1;
            }

            if (sx === 1 && sy === 1) {
                return;
            }

            var me = this;

            $.each(
                me.xProperties,
                function (index, name) {
                    if ($.type(me[name]) === 'number') {
                        me[name] *= sx;
                    }
                }
            );

            $.each(
                me.yProperties,
                function (index, name) {
                    if ($.type(me[name]) === 'number') {
                        me[name] *= sy;
                    }
                }
            );

            if ($.isArray(me.points)) {
                $.each(
                    me.points,
                    function (index, point) {
                        point.x *= sx;
                        point.y *= sy;
                    }
                );
            }

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

        isPointInPath: function (x, y) {
            // [TODO] Non Zero Winding Rule
        },

        isPointInStroke: function (x, y) {
            // [TODO] 求点到线段和曲线的距离
        },

        /**
         * 测试点是否在图形的矩形范围内
         *
         * @param {Object} point
         * @return {boolean}
         */
        testPoint: function (point) {

            var me = this;

            var boundaryRect = me.getBoundaryRect();
            if (!boundaryRect) {
                return false;
            }

            var left = boundaryRect.x;
            var top = boundaryRect.y;
            var right = left + boundaryRect.width;
            var bottom = top + boundaryRect.height;

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
         * 获取图形的矩形区域
         *
         * @return {Object}
         */
        getBoundaryRect: $.noop,

        /**
         * 绘制图形
         *
         * @param {CanvasRenderingContext2D} context
         */
        draw: function (context) {

            var me = this;

            me.createPath(context);

            if (me.lineWidth > 0 && me.strokeStyle) {
                me.stroke(context);
            }

            if (me.fillStyle) {
                me.fill(context);
            }

        },

        /**
         * 通过开始结束点更新图形
         *
         * @param {Object} startPoint
         * @param {Object} endPoint
         */
        updatePoint: $.noop,

        /**
         * 创建绘制路径
         *
         * @param {CanvasRenderingContext2D} context
         */
        createPath: $.noop,

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

            me.strokeShape(context);

            context.restore();

        },

        /**
         * 执行描边动作
         *
         * @param {CanvasRenderingContext2D} context
         */
        strokeShape: function (context) {
            context.stroke();
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

            me.fillShape(context);

            context.restore();

        },

        /**
         * 执行填充动作
         *
         * @param {CanvasRenderingContext2D} context
         */
        fillShape: function (context) {
            context.fill();
        },

        /**
         * 判断图形是否符合要求
         *
         * @return {boolean}
         */
        validate: function () {
            return true;
        },

        /**
         * 克隆图形
         *
         * @return {Object}
         */
        clone: function () {

            var properties = { };

            $.extend(true, properties, this);

            return new this.constructor(properties);

        },

        /**
         * 序列化
         */
        serialize: function () {

            var me = this;
            var result = { };

            $.each(
                me.serializableProperties,
                function (index, name) {
                    if (me[name] != null) {
                        result[name] = me[name];
                    }
                }
            );

            return result;

        }

    };

    Shape.defaultOptions = {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 1
    };

    return Shape;

});
