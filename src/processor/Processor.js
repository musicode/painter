/**
 * @file 操作基类
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var eventEmitter = require('../eventEmitter');
    var DrawingSurface = require('../DrawingSurface');

    var namespace = '.painter_processor';

    function getGlobalPoint(e) {
        return {
            x: e.pageX,
            y: e.pageY
        };
    }

    function getLocalPoint(globalPoint, canvas) {

        var pos = canvas.getBoundingClientRect();
        var scaleX = canvas.width  / pos.width;
        var scaleY = canvas.height  / pos.height;

        return {
            x: (globalPoint.x - pos.left) * scaleX,
            y: (globalPoint.y - pos.top)  * scaleY
        };

    }

    /**
     * @param {Object} options
     * @property {CanvasRenderingContext2D} context
     */
    function Processor(options) {
        $.extend(this, options);
        this.init();
    }

    Processor.prototype = {

        constructor: Processor,

        init: function () {

            var me = this;

            me.drawingSurface = new DrawingSurface();

            var canvas = me.context.canvas;

            var downHandler = function (e) {

                var globalPoint = getGlobalPoint(e);

                me.down(
                    e,
                    getLocalPoint(globalPoint, canvas),
                    globalPoint
                );

            };

            var moveHandler = function (e) {

                var globalPoint = getGlobalPoint(e);

                me.move(
                    e,
                    getLocalPoint(globalPoint, canvas),
                    globalPoint
                );

            };

            var upHandler = function (e) {

                var globalPoint = getGlobalPoint(e);

                me.up(
                    e,
                    getLocalPoint(globalPoint, canvas),
                    globalPoint
                );

            };

            var $canvas = $(canvas);

            if ('ontouchend' in window) {
                $canvas
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

            $canvas
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

            $(this.context.canvas).off(namespace);
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
                        shape: shape
                    }

                );

            }

        },

        save: function () {

            var me = this;

            me.drawingSurface.save(
                me.context
            );

        },

        restore: function () {

            var me = this;

            me.drawingSurface.restore(
                me.context
            );

        },

        down: $.noop,

        move: $.noop,

        up: $.noop

    };


    return Processor;

});