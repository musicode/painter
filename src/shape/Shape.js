/**
 * @file 图形基类
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var extend = require('../util/extend');
    var guid = require('../util/guid');
    var drawLines = require('../util/lines');

    /**
     * @param {Object} options
     * @property {number} options.x
     * @property {number} options.y
     * @property {string} options.strokeStyle
     * @property {string} options.fillStyle
     * @property {number} options.lineWidth
     */
    function Shape(options) {
        extend(this, Shape.defaultOptions, options);
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

            this.drawPath(context, canvas.width, canvas.height);

        },

        drawPath: function (context, canvasWidth, canvasHeight) {

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
        pointInPath: function (context, point) {
            this.createPath(context);
            return context.pointInPath(point);
        },

        /**
         * 描边
         *
         * @param {CanvasRenderingContext2D} context
         */
        stroke: function (context) {

            context.save();

            context.lineWidth = this.lineWidth;
            context.strokeStyle = this.strokeStyle;
            context.stroke();

            context.restore();
console.log('stroke')
        },

        /**
         * 填充
         *
         * @param {CanvasRenderingContext2D} context
         */
        fill: function (context) {

            context.save();

            context.fillStyle = this.fillStyle;
            context.fill();

            context.restore();

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
        lineWidth: 0.5,
        strokeStyle: '#666'
    };

    return Shape;

});
