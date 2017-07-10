/**
 * @file 矩形包围盒
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    function BoundingRect(options) {
        $.extend(this, options);
    }

    BoundingRect.prototype = {

        constructor: BoundingRect,

        /**
         * 交集
         *
         * @param {Object} rect
         * @return {Object}
         */
        intersect: function (rect) {
            rect = intersect(me, rect);
            if (rect) {
                return new BoundingRect(rect);
            }
        },

        /**
         * 并集
         *
         * @param {Object} rect
         * @return {Object}
         */
        union: function (rect) {
            return new BoundingRect(
                union(me, rect)
            );
        },

        /**
         * 点是否在矩形范围内
         *
         * @param {number} x
         * @param {number} y
         * @return {boolean}
         */
        contain: function (x, y) {
            var me = this;
            return x >= me.x
                && y >= me.y
                && x <= (me.x + me.width)
                && y <= (me.y + me.height);
        },

        /**
         * 克隆自己
         *
         * @return {Object}
         */
        clone: function () {
            var me = this;
            return new BoundingRect(me.x, me.y, me.width, me.height);
        }

    };

    /**
     * 计算两个矩形的交集
     *
     * @inner
     * @param {Object} rect1
     * @param {Object} rect2
     * @return {Object}
     */
    function intersect(rect1, rect2) {

        var left1 = rect1.x;
        var top1 = rect1.y;
        var right1 = left1 + rect1.width;
        var bottom1 = top1 + rect1.height;

        var left2 = rect2.x;
        var top2 = rect2.y;
        var right2 = left2 + rect2.width;
        var bottom2 = top2 + rect2.height;

        if (left1 > right2
            || top1 > bottom2
            || right1 < left2
            || bottom1 < top2
        ) {

        }
        else {

            var x = Math.max(left1, left2);
            var y = Math.max(top1, top2);

            return {
                x: x,
                y: y,
                width: Math.min(right1, right2) - x,
                height: Math.min(bottom1, bottom2) - y
            };

        }

    }

    /**
     * 计算两个矩形的并集
     *
     * @inner
     * @param {Object} rect1
     * @param {Object} rect2
     * @return {Object}
     */
    function union(rect1, rect2) {

        var left1 = rect1.x;
        var top1 = rect1.y;
        var right1 = left1 + rect1.width;
        var bottom1 = top1 + rect1.height;

        var left2 = rect2.x;
        var top2 = rect2.y;
        var right2 = left2 + rect2.width;
        var bottom2 = top2 + rect2.height;

        var x = Math.min(left1, left2);
        var y = Math.min(top1, top2);

        return {
            x: x,
            y: y,
            width: Math.max(right1, right2) - x,
            height: Math.max(bottom1, bottom2) - y
        };

    }

    return BoundingRect;

});