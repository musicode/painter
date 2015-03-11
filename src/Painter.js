/**
 * @file 画笔
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var window2Canvas = require('./util/window2Canvas');
    var snapshoot = require('./util/snapshoot');
    var Shape = require('./Shape');

    function Painter(options) {
        this.context = options.context;
        this.init();
    }

    Painter.prototype = {

        constructor: Painter,

        init: function () {

            /**
             * 操作历史
             *
             * @type {Array}
             */
            this.history = [ ];

        },

        addShape: function (shape) {
            var index = this.history.push(shape);
            shape.index = index - 1;

            console.log(shape.x, shape.y, shape.width, shape.height);
        },

        /**
         * 删除 Shape
         *
         * @param {Array.<Object} shapes
         */
        removeShape: function (shapes) {

            if (!Array.isArray(shapes)) {
                shapes = [ shapes ];
            }

            if (shapes.length === 0) {
                return;
            }

            // shapes 按索引倒序排列，方便删除
            shapes = shapes.sort(
                function (a, b) {
                    return b.index - a.index;
                }
            );

            var me = this;
            var history = me.history;

            shapes.forEach(
                function (shape) {
                    history.splice(shape.index, 1);
                }
            );

            var shape = shapes[ shapes.length - 1 ];
            var context = me.context;

            shape.undo(context);

            for (var i = shape.index, len = history.length; i < len; i++) {

                shape = history[i];

                shape.index = i;
                shape.snapshoot = snapshoot(context);
                shape.draw(context);

            }

        },

        startClearing: function (type) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            var history = me.history;

            canvas.onmousedown = function (e) {

                var point = window2Canvas(canvas, e.clientX, e.clientY);

                var shapes = [ ];

                history.forEach(
                    function (shape) {
                        if (shape.inRect(point)) {
                            shapes.push(shape);
                        }
                    }
                );

                me.removeShape(shapes);

            };
        },

        startDrawing: function (name) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;


            var shape;

            var draw = function (action) {
                shape.undo(context);
                return shape.draw(context, action);
            };

            canvas.onmousedown = function (e) {

                shape = new Shape({
                    name: name,
                    action: 'add',
                    snapshoot: snapshoot(context),
                    points: [
                        window2Canvas(canvas, e.clientX, e.clientY)
                    ],
                    style: {
                        thickness: context.lineWidth,
                        stroke: context.strokeStyle,
                        fill: context.fillStyle
                    }
                });

                if (draw('down')) {

                    document.onmousemove = function (e) {

                        shape.addPoint(
                            window2Canvas(canvas, e.clientX, e.clientY)
                        );

                        draw('move');
                    };

                    document.onmouseup = function () {

                        draw('up');

                        me.addShape(shape);

                        document.onmousemove =
                        document.onmouseup = null;

                    };

                }

            };



        },

        stopDrawing: function () {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            canvas.onmousedown = null;
        }
    };

    return Painter;

});