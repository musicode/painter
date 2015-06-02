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

    var devicePixelRatio = require('../config').devicePixelRatio;

    function parseLineHeight(textarea) {
        var lineHeight = textarea.css('line-height');
        if (lineHeight === 'normal') {
            lineHeight = textarea.css('font-size');
        }
        return parseInt(lineHeight, 10);
    }

    /**
     * 因为每次都会在 processor 对象上绑定一个 textarea 属性
     * 所以不能直接从属性上取，因为这个 textarea 是会变化的
     */
    function submitText(processor, textarea) {

        // 已删除
        if (textarea.isRemove) {
            return;
        }

        var text = $.trim(textarea.val());

        if (text) {

            var point = processor.point;

            processor.shape = new Shape({
                x: point.x,
                y: point.y,
                text: text,
                fontSize: processor.fontSize * devicePixelRatio,
                fontFamily: processor.fontFamily,
                textAlign: 'left',
                textBaseline: 'top',
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowBlur: 1,
                lineHeight: processor.lineHeight * devicePixelRatio,
                fillStyle: processor.fillStyle
            });

            processor.commit();

            processor.shape = null;

        }

        textarea.remove();
        textarea.isRemove = true;

        processor.textarea = null;

    }

    var Text = inherits(
        require('./Processor'),
        {
            name: 'text',

            down: function (point) {

                var me = this;

                var textarea = me.textarea;

                if (textarea) {
                    submitText(me, textarea);
                }

                var fontSize =
                me.fontSize = style.getFontSize();

                var fontFamily =
                me.fontFamily = style.getFontFamily();

                var fillStyle =
                me.fillStyle = style.getFillStyle();


                textarea =

                me.textarea = Text.createTextarea(
                    point.x / devicePixelRatio,
                    point.y / devicePixelRatio,
                    fontSize,
                    fontFamily,
                    fillStyle
                );

                me.point = point;
                me.lineHeight = parseLineHeight(textarea);

                setTimeout(
                    function () {

                        textarea.focus();

                        textarea.blur(
                            function () {
                                submitText(me, textarea);
                            }
                        );

                    }
                );

            }
        }
    );


    return Text;

});