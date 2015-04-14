/**
 * @file 主程序
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var History = require('./History');
    var Action = require('./Action');
    var eventEmitter = require('./eventEmitter');

    var retina = require('./util/retina');

    var arrow = require('./action/arrow');
    var eraser = require('./action/eraser');
    var laser = require('./action/laser');
    var painter = require('./action/painter');
    var rect = require('./action/rect');
    var text = require('./action/text');

    var actionMap = {
        arrow: arrow,
        eraser: eraser,
        laser: laser,
        doodle: painter,
        rect: rect,
        text: text
    };

    /**
     * @param {Object} options
     * @property {CanvasRenderingContext2D} options.context
     * @property {Function} options.stage
     */
    function Main(options) {
        $.extend(this, options);
        this.init();
    }

    Main.prototype = {

        constructor: Main,

        init: function () {

            var me = this;
            var context = me.context;

            me.history = new History({
                context: context
            });

            me.clear();


            eventEmitter
            .on(eventEmitter.SHAPE_ADD, function (e, data) {

                var shape = data.shape;
                var action = Action.addAction(shape);

                action.do = function (context) {
                    actionMap[shape.name.toLowerCase()].draw(context, shape);
                };

                me.history.push(action);

            })
            .on(eventEmitter.SHAPE_REMOVE, function (e, data) {

                var shape = data.shape;

                me.removed[ shape.id ] = true;

                var action = Action.removeAction(shape);
                me.history.push(action);

            })
            .on(eventEmitter.ACTION_PUSH, function (e, data) {

                me.refresh();

            });


        },

        /**
         * 改变画布大小
         *
         * @param {number} width 显示宽度
         * @param {number} height 显示高度
         */
        resize: function (width, height) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            var style = 'width:' + width + 'px;'
                      + 'height:' + height + 'px';

            canvas.style.cssText = style;

            retina(canvas);

            // 改变大小会清空画布，所以要重绘
            me.refresh();

        },

        refresh: function () {

            var me = this;
            var context = me.context;

            me.clear();

            $.each(
                me.history.getLiveActionList(),
                function (index, action) {
                    action.do(context);
                }
            );

        },

        /**
         * 清空画布
         *
         * @param {boolean} clearHistory 是否清空历史纪录
         */
        clear: function (clearHistory) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            context.clearRect(0, 0, canvas.width, canvas.height);

            me.stage(context);

            if (clearHistory) {
                me.history.clear();
            }

        },

        laser: function () {
            this.changeAction(laser);
        },

        painter: function () {
            this.changeAction(painter);
        },

        text: function () {
            this.changeAction(text);
        },

        arrow: function () {
            this.changeAction(arrow);
        },

        rect: function () {
            this.changeAction(rect);
        },

        erase: function () {

            var me = this;
            var list = me.history.getLiveActionList();

            me.removed = { };

            this.changeAction(
                eraser,
                function (fn) {

                    $.each(
                        list,
                        function (index, action) {

                            var shape = action && action.shape;

                            if (shape && !me.removed[ shape.id ]) {
                                fn(shape);
                            }

                        }
                    );

                }
            );

        },

        undo: function () {
            var me = this;
            me.history.undo(me.context);
            me.refresh();
        },

        redo: function () {
            var me = this;
            me.history.redo(me.context);
            me.refresh();
        },

        changeAction: function (action, data) {

            var me = this;
            var context = me.context;

            var activeAction = me.activeAction;
            if (activeAction) {
                activeAction.end(context);
            }

            action.start(context, data);

            me.activeAction = action;

        }

    };


    return Main;

});