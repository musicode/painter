/**
 * @file 文本工具
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('../style');
    var eventEmitter = require('../eventEmitter');

    var Shape = require('../shape/Text');
    var Action = require('../action/Text');

    var canvas2Window = require('../util/canvas2Window');
    var inherits = require('../util/inherits');

    function createTextarea(x, y, fontSize, color) {
        return $(
            '<textarea class="canvas-textarea" '
          + 'style="position:absolute;left:' + x + 'px;top:' + y + 'px;'
          + 'font-size:' + fontSize + 'px;'
          + 'color:' + color + ';'
          + '">'
          + '</textarea>'
        );
    }

    return inherits(
        require('./Processor'),
        {
            name: 'text',

            down: function (e, point) {

                var me = this;

                if (me.textarea) {
                    // click 会先于 blur 触发
                    // 这里让 blur 去处理
                    return;
                }

                var fontSize = style.getFontSize();
                var fillStyle = style.getFillStyle();

                var canvas = me.context.canvas;

                var raw = canvas2Window(canvas, point);

                var textarea =

                me.textarea = createTextarea(raw.x, raw.y, fontSize, fillStyle);

                textarea.appendTo('body');

                setTimeout(
                    function () {

                        textarea.focus();

                        textarea.blur(
                            function () {

                                var text = $.trim(textarea.val());

                                if (text) {

                                    var options = {
                                        x: point.x,
                                        y: point.y,
                                        text: text,
                                        fontSize: fontSize,
                                        align: 'start',
                                        baseLine: 'top'
                                    };

                                    me.action = new Action({
                                        shape: me.createShape(Shape, options)
                                    });

                                    me.commit();

                                }

                                textarea.remove();

                                me.textarea = null;

                            }
                        );

                    }
                );

            }
        }
    );

});