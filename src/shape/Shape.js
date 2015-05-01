/**
 * @file 图形基类
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var guid = require('../util/guid');
    var drawLines = require('../util/lines');

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
     * @property {boolean} options.adaptive 是否自适应，默认是 true
     */
    function Shape(options) {
        $.extend(this, Shape.defaultOptions, options);
        this.init();
    }

    Shape.prototype = {

        constructor: Shape,

        init: function () {

            /**
             * 形状全局唯一的 ID
             *
             * @type {string}
             */
            this.id = guid();

        },

        /**
         * 某些不规则 Shape 需要点的数组，比如涂鸦
         *
         * @return {Array}
         */
        getPoints: function () {

            var points = this.points;

            return Array.isArray(points) ? points : [ ];

        },

        /**
         * 创建绘制路径
         */
        createPath: function (context) {

            var canvas = context.canvas;

            context.beginPath();

            var width = canvas.width;
            var height = canvas.height;

            if (!this.adaptive) {
                width = height = 1;
            }

            this.createPathExtend(context, width, height);

        },

        createPathExtend: function (context, canvasWidth, canvasHeight) {

            var points = this.getPoints();

            if (points.length > 0) {

                points = points.map(function (point) {
                    return {
                        x: point.x * canvasWidth,
                        y: point.y * canvasHeight
                    };
                });

                drawLines(context, points);

            }

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

            context.shadowColor = me.shadowColor;
            context.shadowOffsetX = me.shadowOffsetX;
            context.shadowOffsetY = me.shadowOffsetY;
            context.shadowBlur = me.shadowBlur;

            context.lineWidth = me.lineWidth;
            context.strokeStyle = me.strokeStyle;
            context.stroke();

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

            context.shadowColor = me.shadowColor;
            context.shadowOffsetX = me.shadowOffsetX;
            context.shadowOffsetY = me.shadowOffsetY;
            context.shadowBlur = me.shadowBlur;

            context.fillStyle = me.fillStyle;
            context.fill();

            context.restore();

        },

        /**
         * 把非自适应的 Shape 改为自适应
         *
         * @param {boolean} adaptive
         * @param {number} width
         * @param {number} height
         */
        toAdaptive: function (adaptive, width, height) {

            var me = this;

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

        /**
         * 创建边界路径
         *
         * @param {CanvasRenderingContext2D} context
         */
        createBoundaryPath: function (context) {

            var me = this;
            var canvas = context.canvas;

            context.beginPath();

            var width = canvas.width;
            var height = canvas.height;

            if (!me.adaptive) {
                width = height = 1;
            }

            var rect = me.getBoundaryRect(context);

            context.rect(
                rect.x * width,
                rect.y * height,
                rect.width * width,
                rect.height * height
            );

        }

    };

    Shape.defaultOptions = {
        adaptive: false,
        lineWidth: 0.5,
        fillStyle: '#666',
        strokeStyle: '#666',
        shadowColor: undefined,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowBlur: 0
    };


    return Shape;

});
