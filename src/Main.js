/**
 * @file 主程序
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var config = require('./config');

    var retina = require('./function/retina');

    /**
     * @param {Object} options
     * @property {CanvasRenderingContext2D} options.context
     * @property {Function} options.stage 初始化舞台，clear 也会调此函数
     */
    function Main(options) {
        $.extend(this, options);
        this.init();
    }

    Main.prototype = {

        constructor: Main,

        init: function () {

            var me = this;

            /**
             * 图形列表
             *
             * @type {Array}
             */
            me.shapes = [ ];

            var canvas = me.context.canvas;

            /**
             * 画布的宽度
             *
             * @type {number}
             */
            me.width = canvas.width;

            /**
             * 画布的高度
             *
             * @type {number}
             */
            me.height = canvas.height;

            /**
             * 封装成 jQuery 对象
             *
             * @type {jQuery}
             */
            me.canvas = $(canvas);

            /**
             * 离屏 canvas
             *
             * @type {jQuery}
             */
            me.fakeCanvas = me.canvas.clone();

            me.on('selectstart', function () {
                return false;
            });

            me.clear();

        },

        dispose: function () {

            var me = this;

            me.off();

            me.shapes.length = 0;

            me.imageData = null;

        },

        addTrigger: function (shapes) {

            var me = this;

            if (!$.isArray(shapes)) {
                shapes = [ shapes ];
            }

            me.trigger(
                me.SHAPE_ADD_TRIGGER,
                {
                    shapes: shapes
                }
            );

        },

        removeTrigger: function (shapes) {

            var me = this;

            if (!$.isArray(shapes)) {
                shapes = [ shapes ];
            }

            me.trigger(
                me.SHAPE_REMOVE_TRIGGER,
                {
                    shapes: shapes
                }
            );

        },

        updateTrigger: function (shapes) {

            var me = this;

            if (!$.isArray(shapes)) {
                shapes = [ shapes ];
            }

            me.trigger(
                me.SHAPE_UPDATE_TRIGGER,
                {
                    shapes: shapes
                }
            );

        },

        /**
         * 添加 shape
         *
         * @param {Object|Array} shapes
         */
        addShape: function (shapes) {

            if (!$.isArray(shapes)) {
                shapes = [ shapes ];
            }

            var me = this;

            $.each(shapes, function (index, shape) {

                me.shapes.push(shape);

                shape.draw(me.context);

            });

            me.save();

            me.trigger(
                me.SHAPE_ADD,
                {
                    shapes: shapes
                }
            );

        },

        /**
         * 删除一个 shape
         *
         * @param {string|Array} shapeIds
         */
        removeShape: function (shapeIds) {

            if (!$.isArray(shapeIds)) {
                shapeIds = [ shapeIds ];
            }

            var me = this;
            var result = [ ];

            $.each(shapeIds, function (index, shapeId) {

                index = me.getShapeIndex('id', shapeId);

                if (index >= 0) {

                    var shapes = me.shapes;

                    result.push(shapes[ index ]);

                    shapes.splice(index, 1);

                }

            });

            if (result.length > 0) {

                me.refresh();

                me.trigger(
                    me.SHAPE_REMOVE,
                    {
                        shapes: result
                    }
                );

            }

        },

        /**
         * 更新 shape
         *
         * @param {Object|Array} shapes
         */
        updateShape: function (shapes) {

            if (!$.isArray(shapes)) {
                shapes = [ shapes ];
            }

            var me = this;
            var result = [ ];

            $.each(shapes, function (index, shape) {
                var target = me.getShapeByNumber(shape.number);
                if (target) {
                    $.extend(target, shape);
                    result.push(shape);
                }
            });

            if (result.length > 0) {

                me.refresh();

                me.trigger(
                    me.SHAPE_UPDATE,
                    {
                        shapes: result
                    }
                );

            }

        },

        /**
         * 获取 shape 的索引
         *
         * @param {string} name 查找的字段名
         * @param {string|number} value 查找的字段值
         * @return {number}
         */
        getShapeIndex: function (name, value) {

            var me = this;

            var result = -1;

            $.each(
                me.shapes,
                function (index, shape) {
                    if (shape[name] === value) {
                        result = index;
                        return false;
                    }
                }
            );

            return result;

        },

        /**
         * 通过 id 查找 shape
         *
         * @param {string} id
         * @return {Object?}
         */
        getShapeById: function (id) {

            var me = this;

            var index = me.getShapeIndex('id', id);

            return me.shapes[index];

        },

        /**
         * 通过 number 查找 shape
         *
         * @param {string} number
         * @return {Object?}
         */
        getShapeByNumber: function (number) {

            var me = this;

            var index = me.getShapeIndex('number', number);

            return me.shapes[index];

        },

        /**
         * 改变画布大小
         *
         * @param {number} viewWidth 显示宽度
         * @param {number} viewHeight 显示高度
         */
        resize: function (viewWidth, viewHeight) {

            if (!viewWidth || !viewHeight) {
                return;
            }

            var me = this;

            var oldWidth = me.width;
            var oldHeight = me.height;

            var devicePixelRatio = config.devicePixelRatio;

            var newWidth = viewWidth * devicePixelRatio;
            var newHeight = viewHeight * devicePixelRatio;

            if (oldWidth !== newWidth || oldHeight !== newHeight) {

                var style = {
                    width: viewWidth,
                    height: viewHeight
                };

                var canvas = me.getCanvas();
                var fakeCanvas = me.getFakeCanvas();

                canvas.css(style);
                retina(canvas);

                fakeCanvas.css(style);
                retina(fakeCanvas);

                me.width = newWidth;
                me.height = newHeight;

                // x 坐标转换因数
                var xFactor = oldWidth > 0
                            ? (newWidth / oldWidth)
                            : 1;

                // y 坐标转换因数
                var yFactor = oldHeight > 0
                            ? (newHeight / oldHeight)
                            : 1;

                // 改变大小会清空画布，所以要重绘
                me.refresh(xFactor, yFactor);

            }

        },

        /**
         * 刷新画布
         */
        refresh: function (xFactor, yFactor) {

            var me = this;
            var context = me.context;

            me.clear(true);

            $.each(
                me.shapes,
                function (index, shape) {
                    shape.scale(xFactor, yFactor);
                    shape.draw(context);
                }
            );

            me.save();

        },

        /**
         * 清空画布
         */
        clear: function () {

            var me = this;

            me.stage(me.context);

            if (arguments[0] !== true) {

                me.shapes.length = 0;
                me.save();

                me.trigger(
                    me.SHAPE_CLEAR
                );

            }

        },

        /**
         * 保存绘图表面
         */
        save: function () {

            var me = this;

            var context = me.context;

            var width = me.width;
            var height = me.height;

            if (context.getImageData && width > 0 && height > 0) {
                me.imageData = context.getImageData(0, 0, width, height);
            }

        },

        /**
         * 恢复绘图表面
         */
        restore: function () {

            var me = this;

            var context = me.context;
            var imageData = me.imageData;

            if (context.putImageData && imageData) {
                context.putImageData(imageData, 0, 0);
            }

        },

        /**
         * 获取 canvas
         *
         * @returns {jQuery}
         */
        getCanvas: function () {
            return this.canvas;
        },

        /**
         * 获取离屏 canvas
         *
         * @returns {jQuery}
         */
        getFakeCanvas: function () {
            return this.fakeCanvas;
        },

        /**
         * 监听事件
         *
         * @param {string} type 事件名称
         * @param {Function} handler 事件处理函数
         */
        on: function (type, handler) {

            var me = this;

            me.canvas.on(type, handler);

            return me;

        },

        /**
         * 取消监听事件
         *
         * @param {string} type 事件名称
         * @param {Function} handler 事件处理函数
         */
        off: function (type, handler) {

            var me = this;

            me.canvas.off(type, handler);

            return me;

        },

        /**
         * 触发事件
         *
         * @param {string} type 事件名称
         * @param {Object?} data 事件数据
         */
        trigger: function (type, data) {

            var me = this;

            me.canvas.trigger(type, data);

            return me;

        },

        /**
         * 事件 - 触发添加形状
         *
         * @type {string}
         */
        SHAPE_ADD_TRIGGER: 'shape_add_trigger',

        /**
         * 事件 - 触发删除形状
         *
         * @type {string}
         */
        SHAPE_REMOVE_TRIGGER: 'shape_remove_trigger',

        /**
         * 事件 - 触发更新形状
         *
         * @type {string}
         */
        SHAPE_UPDATE_TRIGGER: 'shape_update_trigger',

        /**
         * 事件 - 添加形状
         *
         * @type {string}
         */
        SHAPE_ADD: 'shape_add',

        /**
         * 事件 - 删除形状
         *
         * @type {string}
         */
        SHAPE_REMOVE: 'shape_remove',

        /**
         * 事件 - 更新形状
         *
         * @type {string}
         */
        SHAPE_UPDATE: 'shape_update',

        /**
         * 事件 - 鼠标指针移动
         *
         * @type {string}
         */
        CURSOR_MOVE: 'cursor_move',

        /**
         * 事件 - 清空形状
         *
         * @type {string}
         */
        SHAPE_CLEAR: 'shape_clear'

    };


    return Main;

});