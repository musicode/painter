/**
 * @file 文本工具
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('../style');
    var eventEmitter = require('../eventEmitter');

    var Shape = require('../shape/Text');

    var inherits = require('../util/inherits');

    function createTextarea(x, y, fontSize, fontFamily, color) {
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

            down: function (e, point, globalPoint) {

                var me = this;

                if (me.textarea) {
                    // click 会先于 blur 触发
                    // 这里让 blur 去处理
                    return;
                }

                var fontSize = style.getFontSize();
                var fontFamily = style.getFontFamily();
                var fillStyle = style.getFillStyle();

                var canvas = me.context.canvas;
console.log('local', point);
console.log('global', globalPoint);
                var textarea =

                me.textarea = createTextarea(
                    globalPoint.x,
                    globalPoint.y,
                    fontSize,
                    fontFamily,
                    fillStyle
                );

                textarea.appendTo('body');

                setTimeout(
                    function () {

                        textarea.focus();

                        textarea.blur(
                            function () {

                                var text = $.trim(textarea.val());

                                if (text) {

                                    me.shape = new Shape({
                                        x: point.x,
                                        y: point.y,
                                        text: text,
                                        fontSize: fontSize,
                                        fontFamily: fontFamily,
                                        textAlign: 'start',
                                        textBaseLine: 'top',
                                        shadowColor: 'rgba(0,0,0,0.2)',
                                        shadowOffsetX: 1,
                                        shadowOffsetY: 1,
                                        shadowBlur: 1,
                                        fillStyle: fillStyle
                                    });

                                    me.commit();

                                    me.shape = null;

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