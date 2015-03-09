/**
 * @file 画笔
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var window2Canvas = require('./util/window2Canvas');
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

        startClearing: function (type) {

        },

        startDrawing: function (name) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;


            var shape;

            var draw = function (action) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                me.restoreDrawingSurface();

                shape.draw(context, action);
            };

            canvas.onmousedown = function (e) {

                shape = new Shape({
                    name: name,
                    action: 'add',
                    points: [
                        window2Canvas(canvas, e.clientX, e.clientY)
                    ],
                    style: {
                        thickness: context.lineWidth,
                        stroke: context.strokeStyle,
                        fill: context.fillStyle
                    }
                });

                me.saveDrawingSurface();

                document.onmousemove = function (e) {

                    shape.addPoint(
                        window2Canvas(canvas, e.clientX, e.clientY)
                    );

                    draw('move');
                };

                document.onmouseup = function () {

                    draw('up');

                    me.history.push(shape);

                    document.onmousemove =
                    document.onmouseup = null;

                };
            };



        },

        stopDrawing: function () {

        },

        saveDrawingSurface: function () {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            me.drawingSurface = context.getImageData(
                                    0,
                                    0,
                                    canvas.width,
                                    canvas.height
                                );
        },

        restoreDrawingSurface: function () {

            var me = this;

            me.context.putImageData(
                me.drawingSurface,
                0,
                0
            );
        }

    };

    return Painter;

});