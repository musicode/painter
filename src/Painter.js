/**
 * @file 画笔
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var drawGrid = require('./draw/grid');
    var drawLine = require('./draw/line');
    var drawLines = require('./draw/lines');
    var drawEllipse = require('./draw/ellipse');

    function Painter(canvas) {
        this.context = canvas.getContext('2d');
    }

    Painter.prototype = {

        constructor: Painter,

        /**
         * 增强 retina 屏幕的体验
         */
        retina: function () {

            var ratio = window.devicePixelRatio;

            if (ratio > 1) {

                var canvas = this.context.canvas;
                var style = window.getComputedStyle(canvas);

                canvas.width = ratio * parseInt(style.width, 10);
                canvas.height = ratio  * parseInt(style.height, 10);

            }

        },

        /**
         * 清屏
         */
        clear: function () {
            var context = this.context;
            var canvas = context.canvas;
            context.clearRect(0, 0, canvas.width, canvas.height);
        },

        /**
         * 绘制网格
         *
         * @param {number} stepX 水平间隔
         * @param {number} stepY 垂直间隔
         * @param {string} color 线条颜色
         * @param {number} lineWidth 线条粗细
         */
        grid: function (stepX, stepY, color, lineWidth) {
            drawGrid(this.context, stepX, stepY, color, lineWidth);
        },

        /**
         * 绘制线条
         *
         * @param {number} x1 起点横坐标
         * @param {number} y1 起点纵坐标
         * @param {number} x2 终点横坐标
         * @param {number} y2 终点纵坐标
         * @param {string} color 线条颜色
         * @param {number} lineWidth 线条粗细
         */
        line: function (x1, y1, x2, y2, color, lineWidth) {
            drawLine(this.context, x1, y1, x2, y2, color, lineWidth);
        },

        /**
         * 绘制一条由多个点组成的线段
         *
         * @param {Array.<Object>} points 点的数组
         * @param {string} color 线条颜色
         * @param {number} lineWidth 线条粗细
         */
        lines: function (points, color, lineWidth) {
            drawLines(this.context, points, color, lineWidth);
        },

        /**
         * 绘制椭圆
         *
         * @param {number} x 椭圆左上角横坐标
         * @param {number} y 椭圆左上角纵坐标
         * @param {number} width 椭圆宽度
         * @param {number} height 椭圆高度
         * @param {string} color 线条颜色
         * @param {number} lineWidth 线条粗细
         */
        ellipse: function (x, y, width, height, color, lineWidth) {
            drawEllipse(this.context, x, y, width, height, color, lineWidth);
        },

        text: function (text, x, y, face, size) {

            var context = this.context;

            context.save();

            if (face || size) {
                context.font = [ size, face ].join(' ').trim();
            }

            text.split('\n').forEach(
                function (text, index) {
                    context.fillText(
                        text,
                        x,
                        y + index * size
                    );
                }
            );

            context.restore();
        }
    };

    return Painter;

});
