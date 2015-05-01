/**
 * @file 操作基类
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('../style');
    var eventEmitter = require('../eventEmitter');

    var window2Canvas = require('../util/window2Canvas');

    /**
     * @param {Object} options
     * @property {CanvasRenderingContext2D} context
     */
    function Action(options) {
        $.extend(this, options);
        this.init();
    }

    Action.prototype = {

        constructor: Action,

        init: function () {

            var me = this;
            var canvas = me.context.canvas;

            var getPoint = function (e) {
                return window2Canvas(canvas, e);
            };

            $(canvas)
                .on(
                    'mousedown' + namespace,
                    function (e) {
                        me.down(e, getPoint(e));
                    }
                );

            $(document)
                .on(
                    'mousemove' + namespace,
                    function (e) {
                        me.move(e, getPoint(e));
                    }
                )
                .on(
                    'mouseup' + namespace,
                    function (e) {
                        me.up(e, getPoint(e));
                    }
                );

            var updateAction = function (e, data) {
                me.updateAction(data);
            };

            eventEmitter
                .on(
                    eventEmitter.FONT_SIZE_CHANGE,
                    updateAction
                )
                .on(
                    eventEmitter.STROKE_STYLE_CHANGE,
                    updateAction
                )
                .on(
                    eventEmitter.FILL_STYLE_CHANGE,
                    updateAction
                )
                .on(
                    eventEmitter.LINE_WIDTH_CHANGE,
                    updateAction
                );

            me.initExtend();

        },

        initExtend: $.noop,

        updateAction: function (data) {

            var action = this.action;

            if (action) {
                action.update(data);
            }
        },

        doAction: function () {

            var action = this.action;

            if (action) {
                action.do(this.context);
            }
        },

        dispose: function () {

            $(this.context.canvas).off(namespace);
            $(document).off(namespace);

        },

        commit: function (isRemove) {

            var me = this;

            var action = me.action;

            if (action) {

                eventEmitter.trigger(

                    isRemove
                    ? eventEmitter.ACTION_REMOVE
                    : eventEmitter.ACTION_ADD,

                    {
                        action: action
                    }

                );

            }

        },

        save: function () {

            eventEmitter.trigger(
                eventEmitter.SAVE_DRAWING_SURFACE_ACTION
            );

        },

        restore: function () {

            eventEmitter.trigger(
                eventEmitter.RESTORE_DRAWING_SURFACE_ACTION
            );

        },

        createShape: function (Shape, params) {

            var me = this;

            var options = {
                shadowColor: 'rgba(0,0,0,0.2)',
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowBlur: 1,
                lineWidth: style.getLineWidth(),
                strokeStyle: style.getStrokeStyle(),
                fillStyle: style.getFillStyle()
            };

            if (params) {
                $.extend(options, params);
            };

            return new Shape(options);

        },

        down: $.noop,

        move: $.noop,

        up: $.noop

    };

    var namespace = '.painter_processor';

    return Action;

});