/**
 * @file 主程序
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var eventEmitter = require('./eventEmitter');
    var DrawingSurface = require('./DrawingSurface');

    var retina = require('./util/retina');

    var Arrow = require('./processor/Arrow');
    var Doodle = require('./processor/Doodle');
    var Eraser = require('./processor/Eraser');
    var Laser = require('./processor/Laser');
    var Rect = require('./processor/Rect');
    var Text = require('./processor/Text');

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

            me.drawingSurface = new DrawingSurface({
                context: context
            });

            me.clear();

            eventEmitter
                .on(
                    eventEmitter.SAVE_DRAWING_SURFACE_ACTION,
                    function () {
                        me.save();
                    }
                )
                .on(
                    eventEmitter.RESTORE_DRAWING_SURFACE_ACTION,
                    function () {
                        me.restore();
                    }
                );

        },

        add: function (action) {

            var me = this;

            me.list.push(action);

            action.do(
                me.context
            );

            me.save();

            eventEmitter.trigger(
                eventEmitter.SHAPE_ADD,
                {
                    shape: action.shape
                }
            );
        },

        remove: function (shapeId) {

            var me = this;
            var list = me.list;

            // 要删除的 shape 索引
            var index;

            $.each(
                list,
                function (i, action) {
                    if (action.shape.id === shapeId) {
                        index = i;
                        return false;
                    }
                }
            );

            if (index >= 0) {

                var shape = list[ index ];

                list.splice(index, 1);

                me.refresh();

                eventEmitter.trigger(
                    eventEmitter.SHAPE_REMOVE,
                    {
                        shape: shape
                    }
                );

            }

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

            $(canvas).css({
                width: width,
                height: height
            });

            retina(canvas);

            // 改变大小会清空画布，所以要重绘
            me.refresh();

        },

        /**
         * 刷新画布
         */
        refresh: function () {

            var me = this;

            me.clear(true);

            $.each(
                me.list,
                function (index, action) {
                    action.do(
                        me.context
                    );
                }
            );

            me.save();

        },

        /**
         * 清空画布
         *
         * @param {boolean} noClearData
         */
        clear: function (noClearData) {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            context.clearRect(0, 0, canvas.width, canvas.height);

            me.stage(context);

            if (!noClearData) {

                me.list = [ ];

                me.save();
            }

        },

        laser: function () {
            this.changeAction(Laser);
        },

        doodle: function () {
            this.changeAction(Doodle);
        },

        text: function () {
            this.changeAction(Text);
        },

        arrow: function () {
            this.changeAction(Arrow);
        },

        rect: function () {
            this.changeAction(Rect);
        },

        eraser: function () {

            var me = this;

            me.changeAction(
                Eraser,
                {
                    iterator: function (fn) {

                        $.each(
                            me.list,
                            function (index, action) {
                                fn(action.shape);
                            }
                        );

                    }
                }
            );

        },

        changeAction: function (Action, extra) {

            var me = this;
            var context = me.context;

            var activeAction = me.activeAction;
            if (activeAction) {
                activeAction.dispose();
            }

            var options = {
                context: context
            };

            if (extra) {
                $.extend(options, extra);
            }

            me.activeAction = new Action(options);

        },

        save: function () {

            this.drawingSurface.save();

            eventEmitter.trigger(
                eventEmitter.SAVE_DRAWING_SURFACE
            );

        },

        restore: function () {

            this.drawingSurface.restore();

            eventEmitter.trigger(
                eventEmitter.RESTORE_DRAWING_SURFACE
            );

        }

    };


    return Main;

});