/**
 * @file 2D 向量
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }

    Vector.prototype = {

        constructor: Vector,

        /**
         * 取反（大小相等，反向相反）
         */
        negate: function () {
            this.multiply(-1);
        },

        /**
         * 加法运算
         *
         * @param {Vector} vector
         */
        add: function (vector) {
            var me = this;
            me.x += vector.x;
            me.y += vector.y;
        },

        /**
         * 加法运算
         *
         * @param {Vector} vector
         */
        subtract: function (vector) {
            this.add(-1 * vector);
        },

        /**
         * 乘以标量
         *
         * @param {number} factor
         */
        multiply: function (factor) {
            var me = this;
            me.x *= factor;
            me.y *= factor;
        },

        /**
         * 除以标量
         *
         * @param {number} factor
         */
        divide: function (factor) {
            this.multiply(1 / factor);
        },

        /**
         * 点乘运算（对应分量相乘）
         *
         * 表示两个向量的相似程度
         *
         * 结果是一个数值
         *
         * 如果 AB = 0，则 AB 互相垂直
         * 如果 AB > 0，则夹角 > 90°
         * 如果 AB < 0，则夹角 < 90°
         *
         * AB = |A||B|cos
         *
         * @param {Vector} vector
         */
        dot: function (vector) {
            var me = this;
            return me.x * vector.x + me.y * vector.y;
        },

        /**
         * 叉乘运算
         *
         * 结果是一个向量
         *
         * 如果 AB = 0，则 AB 平行
         *
         * @param {Vector} vector
         */
        cross: function (vector) {

        },

        /**
         * 获得向量长度
         *
         * @return {number}
         */
        length: function () {
            return Math.sqrt(
                this.lengthSquare()
            );
        },

        /**
         * 获得向量长度的平方
         *
         * @return {number}
         */
        lengthSquare: function () {

            var me = this;

            var x = me.x;
            var y = me.y;

            return x * x + y * y;

        },

        /**
         * 单位向量
         *
         * return {Vector}
         */
        normalize: function () {

            var me = this;
            var length = me.length();

            if (length === 0) {
                me.x =
                me.y = 0;
            }
            else {
                me.x /= length;
                me.y /= length;
            }

        },

        /**
         * 克隆向量
         *
         * @return {Vector}
         */
        clone: function () {

            var me = this;

            return new Vector(me.x, me.y);

        }

    };

    return Vector;

});
