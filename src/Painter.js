define(function (require, exports, module) {

    'use strict';

    var window2Canvas = require('./util/window2Canvas');

    function Painter(options) {
        this.context = options.context;
    }

    Painter.prototype = {

        constructor: Painter,

        init: function () {


        },

        startDrawing: function (type) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            var points = [ ];
            var paint = painters[type];

            var draw = function (action) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                me.restoreDrawingSurface();

                context.beginPath();
                paint(context, points, action);
                context.stroke();
            };

            canvas.onmousedown = function (e) {

                points.push(
                    window2Canvas(canvas, e.x, e.y)
                );

                me.saveDrawingSurface();

                document.onmousemove = function (e) {

                    points.push(
                        window2Canvas(canvas, e.x, e.y)
                    );

                    draw('move');
                };

                document.onmouseup = function () {

                    draw('up');
                    points.length = 0;

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

    var painters = {
        doodle: require('./processor/doodle'),
        line: require('./processor/line'),
        rect: require('./processor/rect'),
        text: function () {

        },
        ellipse: require('./processor/ellipse'),
        arrow: require('./processor/arrow')
    };

    return Painter;

});