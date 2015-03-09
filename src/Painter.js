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

        startClearing: function (type) {

        },

        startDrawing: function (name) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;


            var shape;

            var draw = function (action) {
                shape.undo(context);
                shape.draw(context, action);
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

                draw('down');

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

        }
    };

    return Painter;

});