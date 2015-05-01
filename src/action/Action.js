/**
 * @file 一次动作
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * @param {Object} options
     * @property {Shape} options.shape
     */
    function Action(options) {
        $.extend(this, options);
    }

    Action.prototype = {

        constructor: Action,

        /**
         * 执行动作（绘制图形）
         *
         * @param {CanvasRenderingContext2D} context
         */
        do: function (context) {

            var shape = this.shape;

            shape.createPath(context);
            shape.stroke(context);
        },

        /**
         * 更新 Shape
         *
         * @param {Object} properties 需要更新的属性
         */
        update: function (properties) {
            $.extend(this.shape, properties);
        },

        /**
         * 把 Shape 改为自适应
         *
         * @param {HTMLCanvas} canvas
         */
        toAdaptive: function (canvas) {
            this.shape.toAdaptive(canvas.width, canvas.height);
        }

    };


    return Action;

});