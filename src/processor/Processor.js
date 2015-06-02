/**
 * @file 操作基类
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var eventEmitter = require('../eventEmitter');

    var namespace = '.painter_processor';

    /**
     * @param {Object} options
     * @property {Painter} options.painter
     */
    function Processor(options) {
        $.extend(this, options);
        this.init();
    }

    Processor.prototype = {

        constructor: Processor,

        init: function () {

            var me = this;
            var painter = me.painter;

            me.context = painter.context;

            var canvas = painter.getCanvas();

            var downHandler = function (e) {

                me.down(
                    Processor.getPoint(e, canvas),
                    e
                );

            };

            var moveHandler = function (e) {

                me.move(
                    Processor.getPoint(e, canvas),
                    e
                );

            };

            var upHandler = function (e) {

                me.up(
                    Processor.getPoint(e, canvas),
                    e
                );

            };

            if ('ontouchend' in window) {
                canvas
                    .on(
                        'touchstart' + namespace,
                        downHandler
                    )
                    .on(
                        'touchmove' + namespace,
                        moveHandler
                    )
                    .on(
                        'touchend' + namespace,
                        upHandler
                    );
            }

            canvas
                .on(
                    'mousedown' + namespace,
                    downHandler
                );

            $(document)
                .on(
                    'mousemove' + namespace,
                    moveHandler
                )
                .on(
                    'mouseup' + namespace,
                    upHandler
                );

            me.initExtend();

        },

        initExtend: $.noop,

        dispose: function () {

            var canvas = this.painter.getCanvas();

            canvas.off(namespace);
            $(document).off(namespace);

        },

        commit: function (isRemove) {

            var me = this;

            var shape = me.shape;

            if (shape) {

                eventEmitter.trigger(

                    isRemove
                    ? eventEmitter.SHAPE_REMOVE_TRIGGER
                    : eventEmitter.SHAPE_ADD_TRIGGER,

                    {
                        tool: me.name,
                        shape: shape
                    }

                );

            }

        },

        save: function () {
            this.painter.save();
        },

        restore: function () {
            this.painter.restore();
        },

        down: $.noop,

        move: $.noop,

        up: $.noop

    };

    /**
     * 鼠标相对于 canvas 的坐标（可根据业务需求改写）
     *
     * @param {Event} e
     * @param {jQuery} canvas
     * @return {Object}
     */
    Processor.getPoint = function (e, canvas) {

        var x = e.x || e.clientX;
        var y = e.y || e.clientY;

        var offset = canvas.offset();

        x -= offset.left;
        y -= offset.top;

        var devicePixelRatio = window.devicePixelRatio || 1;

        return {
            x: x * devicePixelRatio,
            y: y * devicePixelRatio
        }
    };

    return Processor;

});