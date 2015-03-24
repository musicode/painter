/**
 * @file 主程序
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var History = require('./History');
    var Action = require('./Action');
    var Painter = require('./Painter');
    var Eraser = require('./Eraser');

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
                context: context
            });

            me.clear();

            var push = function (shape, type) {
                me.history.push(
                    new Action({
                        type: type,
                        shape: shape
                    })
                );
            };

            me.painter = new Painter({
                context: context,
                onAddShape: function (shape) {
                    push(shape, Action.ADD);
                }
            });

            me.eraser = new Eraser({
                context: context,
                onRemoveShape: function (shape) {
                    push(shape, Action.REMOVE);
                }
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

            me.history.iterator(
                function (action, index) {
                    action.save(context);
                    action.do(context);
                },
                'live'
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

            eraser.start(
                function (fn) {
                    history.iterator(
                        function (action) {
                            var shape = action.shape;
                            if (shape) {
                                return fn(shape);
                            }
                        },
                        'live'
                    );
                }
            );

        },

        /**
         * 绘制
         *
         * @param {Object} options
         * @property {string} options.name 形状名称
         * @property {number=} options.thickness 粗细
         * @property {string=} options.strokeColor 描边色
         * @property {string=} options.fillColor 填充色
         */
        paint: function (options) {

            var me = this;
            var painter = me.painter;

            me.eraser.end();
            painter.end();

            painter.start(options);

        },

        undo: function () {

            var me = this;

            me.history.undo(me.context);

        },

        redo: function () {

            var me = this;

            me.history.redo(me.context);

        }

    };


    return Main;

});