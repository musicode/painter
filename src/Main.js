/**
 * @file 主程序
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var History = require('./History');
    var Painter = require('./Painter');
    var Action = require('./Action');
    var Laser = require('./Laser');
    var Eraser = require('./Eraser');

    var each = require('./util/each');
    var extend = require('./util/extend');
    var retina = require('./util/retina');

    /**
     *
     * @param {Object} options
     * @property {CanvasRenderingContext2D} options.context
     * @property {Function} options.stage
     */
    function Main(options) {
        extend(this, options);
        this.init();
    }

    Main.prototype = {

        constructor: Main,

        init: function () {

            var me = this;
            var context = me.context;

            me.history = new History({
                context: context,
                onPush: function () {
                    me.refresh();
                }
            });

            me.clear();

            me.painter = new Painter({
                context: context,
                onAddShape: function (shape, draw) {

                    var action = Action.addAction(shape);

                    action.do = function (context) {
                        draw(shape, context);
                    };

                    me.history.push(action);

                }
            });

            me.eraser = new Eraser({
                context: context,
                onRemoveShape: function (shape) {

                    me.removed[ shape.id ] = true;

                    var action = Action.removeAction(shape);
                    me.history.push(action);

                }
            });

            me.laser = new Laser({
                context: context
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

            each(
                me.history.getLiveActionList(),
                function (action) {
                    action.do(context);
                }
            );

        },

        /**
         * 清空画布
         */
        clear: function () {

            var me = this;
            var context = me.context;
            var canvas = context.canvas;

            context.clearRect(0, 0, canvas.width, canvas.height);

            me.stage(context);

        },

        /**
         * 擦除
         */
        erase: function () {

            var me = this;
            var history = me.history;
            var eraser = me.eraser;

            me.painter.end();
            eraser.end();

            var list = history.getLiveActionList();

            me.removed = { };

            eraser.start(
                function (fn) {

                    each(
                        list,
                        function (action) {

                            var shape = action && action.shape;

                            if (shape && !me.removed[ shape.id ]) {
                                fn(shape);
                            }

                        }
                    );

                }
            );

        },

        /**
         * 绘制
         *
         * @param {string} name 形状名称
         */
        paint: function (name) {

            var me = this;
            var painter = me.painter;

            me.laser.end();
            me.eraser.end();
            painter.end();

            painter.start(name);

        },

        text: function () {

            var me = this;

            me.laser.end();
            me.eraser.end();
            me.painter.end();

        },

        pointer: function () {

            var me = this;

            me.eraser.end();
            me.painter.end();

            me.laser.start();

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

        }

    };


    return Main;

});