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

            var history =
            me.history = new History({
                context: context
            });

            history.push(
                new Action({
                    type: Action.ADD,
                    do: me.stage
                })
            );

            me.painter = new Painter({
                context: context,
                onAddShape: function (shape) {

                    history.push(
                        new Action({
                            type: Action.ADD,
                            shape: shape
                        })
                    );

                }
            });

            me.eraser = new Eraser({
                context: context,
                onRemoveShape: function (shape) {

                    history.push(
                        new Action({
                            type: Action.REMOVE,
                            shape: shape
                        })
                    );

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

            me.history.iterator(
                function (action, index) {

                    if (index > 0) {
                        action.save(context);
                    }
                    else {
                        action.restore(context);
                    }

                    action.do(context);

                },
                'live'
            );
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

        }

    };


    return Main;

});