/**
 * @file 形状
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var guid = require('./util/guid');
    var getRect = require('./util/rect');
    var extend = require('./util/extend');

    var randomColor = require('./util/randomColor');
    var enableShadow = require('./util/enableShadow');
    var disableShadow = require('./util/disableShadow');

    /**
     *
     * @param {Object} options
     * @property {Array.<Object>} options.points 用户操作产生的轨迹点
     * @property {string} options.name 形状名称
     *
     * @property {number} options.x
     * @property {number} options.y
     * @property {number} options.z
     * @property {number} options.width
     * @property {number} options.height
     *
     * @property {string} options.text 文本
     *
     * @property {Object} options.style 样式
     * @property {number} options.style.alpha 透明度
     * @property {number} options.style.thickness 线宽
     * @property {string} options.style.stroke 描边样式
     * @property {string} options.style.fill 填充样式
     *
     * @property {Object} options.shadow 阴影
     * @property {string} options.shadow.color 阴影颜色
     * @property {number} options.shadow.offsetX 阴影水平偏移量
     * @property {number} options.shadow.offsetY 阴影垂直偏移量
     * @property {number} options.shadow.blur 阴影模糊值
     *
     */
    function Shape(options) {
        extend(this, Shape.defaultOptions, options);
        this.init();
    }

    Shape.prototype = {

        constructor: Shape,

        init: function () {

            var me = this;

            /**
             * 形状全局唯一的 ID
             *
             * @type {string}
             */
            me.id = guid();

            if (!Array.isArray(me.points)) {
                me.points = [ ];
            }

        },

        addPoint: function (point) {

            this.points.push(point);

        },

        /**
         * 创建 shape 过程中会创建很多没用的点，这里需要精简一下
         *
         * 比如线条只有起点和终点有意义
         *
         */
        format: function (width, height) {

            var me = this;

            me.points = painters[me.name].trim(me.points);

            extend(me, getRect(me.points));

        },

        /**
         *
         * @param {CanvasRenderingContext2D} context
         * @param {string=} action
         * @return {boolean=}
         */
        draw: function (context, action) {

            var me = this;

            var style = me.style;

            if (style) {
                if (style.alpha != null) {
                    context.globalAlpha = style.alpha;
                }
                if (style.thickness != null) {
                    context.lineWidth = style.thickness;
                }
                if (style.stroke) {
                    context.strokeStyle = style.stroke;
                }
                if (style.fill) {
                    context.fillStyle = style.fill;
                }
            }

            var shadow = me.shadow;

            if (shadow) {
                enableShadow(
                    context,
                    shadow.color,
                    shadow.offsetX,
                    shadow.offsetY,
                    shadow.blur
                );
            }
            else {
                disableShadow(context);
            }

            var painter = painters[me.name];
            if (painter) {
                return painter.draw(context, me, action);
            }

        },

        /**
         * 判断 point 是否在形状的矩形范围内
         *
         * @param {Object} point 经过缩放的点，x 和 y 均在 -1 到 1 之间
         * @return {boolean}
         */
        inRect: function (point) {

            var me = this;

            return point.x > me.x
                && point.x < me.x + me.width
                && point.y > me.y
                && point.y < me.y + me.height;

        },

        /**
         * 显示边界
         *
         * @param {CanvasRenderingContext2D} context
         */
        showBoundary: function (context) {

            var me = this;
            var canvas = context.canvas;

            context.save();

            context.fillStyle = me.boundaryColor;
            context.beginPath();
            context.rect(
                me.x * canvas.width,
                me.y * canvas.height,
                me.width * canvas.width,
                me.height * canvas.height
            );
            context.fill();

            context.restore();

        }
    };

    Shape.defaultOptions = {
        z: 0,
        boundaryColor: randomColor(0.1),
        style: {
            thickness: 0.5
        },
        shadow: {
            color: 'rgba(0,0,0,0.4)',
            offsetX: 2,
            offsetY: 2,
            blur: 4
        }
    };


    var painters = {
        doodle: require('./painter/doodle'),
        line: require('./painter/line'),
        rect: require('./painter/rect'),
        ellipse: require('./painter/ellipse'),
        arrow: require('./painter/arrow'),
        text: require('./painter/text')
    };

    return Shape;

});