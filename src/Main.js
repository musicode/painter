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
     */
    function Main(options) {
        extend(this, options);
        this.init();
    }

    Main.prototype = {

        constructor: Main,

        init: function () {

            var me = this;

            var history =
            me.history = new History();

            var context = me.context;

            var map = { };

            me.painter = new Painter({
                context: context,
                onAddShape: function (shape) {

                    var action = new Action({
                        type: Action.ADD,
                        shape: shape
                    });

                    map[ shape.id ] = action;

                    action.refresh(context);

                    history.addAction(action);

                }
            });

            me.eraser = new Eraser({
                context: context,
                onRemoveShape: function (shape) {

                    var shapeId = shape.id;

                    var action = new Action({
                        type: Action.REMOVE,
                        shapeId: shapeId
                    });

                    history.addAction(action);

                    me.refresh();

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
            var history = me.history;
            var removed = { };

            history.iterator(
                function (action) {
                    if (action.type === Action.REMOVE) {
                        removed[ action.shapeId ] = 1;
                    }
                }
            );

            var context = me.context;

            history.iterator(
                function (action) {
                    if (action.type === Action.ADD
                        && !removed[ action.shape.id ]
                    ) {
                        action.refresh(context);
                    }
                }
            );
        },

        /**
         * 擦除
         */
        erase: function () {

            var me = this;

            me.painter.end();

            me.eraser.start(
                function (fn) {
                    me.history.iterator(
                        function (action) {
                            if (action.type === Action.ADD) {
                                fn(action.shape);
                            }
                        }
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

            me.eraser.end();

            me.painter.start(options);

        }

    };


    return Main;

});