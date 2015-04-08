/**
 * @file 文本工具
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('../style');
    var eventEmitter = require('../eventEmitter');

    var window2Canvas = require('../util/window2Canvas');
    var canvas2Window = require('../util/canvas2Window');
    var saveDrawingSurface = require('../util/saveDrawingSurface');
    var restoreDrawingSurface = require('../util/restoreDrawingSurface');

    var Text = require('../shape/Text');

    var namespace = '.painter_action_text';

    function getPoint(canvas, e) {
        var point = window2Canvas(canvas, e);
        return zoomOut(point, canvas.width, canvas.height);
    }

    exports.start = function (context) {

        var canvas = context.canvas;

        var textarea;

        $(canvas).on(

            'mousedown' + namespace,

            function (e) {

                if (textarea) {
                    // 让 blur 处理
                    return;
                }

                var point = window2Canvas(canvas, e);
                var raw = canvas2Window(canvas, point);

                textarea = $(
                    '<textarea class="canvas-textarea" '
                  + 'style="position:absolute;left:' + raw.x + 'px;top:' + raw.y + 'px;">'
                  + '</textarea>'
                );

                textarea.appendTo('body');

                setTimeout(
                    function () {

                        textarea.focus();

                        textarea.blur(
                            function () {

                                var text = $.trim(textarea.val());

                                if (text) {

                                    var point = window2Canvas(canvas, e);

                                    var shape = new Text({
                                        text: text,
                                        x: point.x,
                                        y: point.y,
                                        align: 'start',
                                        baseLine: 'top'
                                    });

                                    eventEmitter.trigger(
                                        eventEmitter.SHAPE_ADD,
                                        {
                                            shape: shape,
                                            draw: exports.draw
                                        }
                                    );

                                }

                                textarea.remove();
                                textarea = null;

                            }
                        );

                    }
                );

            }
        );

    };

    exports.end = function (context) {
        $(context.canvas).off(namespace);
    };

    exports.draw = function (context, shape) {
        shape.fill(context);
    };

});