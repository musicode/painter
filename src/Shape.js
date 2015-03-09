/**
 * @file 形状
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var extend = require('./util/extend');
    var enableShadow = require('./util/enableShadow');
    var disableShadow = require('./util/disableShadow');
    var getRect = require('./util/rect');

    /**
     *
     * @param {Object} options
     * @property {Array.<Object>} options.points 用户操作产生的轨迹点
     * @property {string} options.action 操作类型，如 add remove
     * @property {string} options.name 形状名称
     * @property {ImageData} options.snapshoot 形状绘制前的快照
     *
     * @property {Object} options.style 样式
     * @property {number} options.style.alpha 透明度
     * @property {number} options.style.thickness 线宽
     * @property {string} options.style.stroke 描边样式
     * @property {string} options.style.fill 填充样式
     *
     * @property {Object} options.shadow 阴影
     * @property {string} options.shadow.color 阴影颜色
     * @property {number} options.shadow.offsetX 阴影水平偏移量
     * @property {number} options.shadow.offsetY 阴影垂直偏移量
     * @property {number} options.shadow.blur 阴影模糊值
     */
    function Shape(options) {
        extend(this, Shape.defaultOptions, options);
        this.init();
    }

    Shape.prototype = {

        constructor: Shape,

        init: function () {

            var me = this;

            if (me.points) {
                extend(me.rect, getRect(me.points));
            }

        },

        addPoint: function (point) {

            var me = this;

            me.points.push(point);

            var rect = me.rect;

            me.rect = getRect([
                { x: rect.x, y: rect.y },
                { x: rect.x + rect.width, y: rect.y + rect.height },
                point
            ]);

        },

        draw: function (context, action) {

            var me = this;

            var style = me.style;

            if (style.alpha != null) {
                context.globalAlpha = style.alpha;
            }
            if (style.thickness != null) {
                context.lineWidth = style.thickness;
            }
            if (style.stroke) {
                context.strokeStyle = style.stroke;
            }
            if (style.fill) {
                context.fillStyle = style.fill;
            }

            var shadow = me.shadow;

            if (shadow) {
                enableShadow(
                    context,
                    shadow.color,
                    shadow.offsetX,
                    shadow.offsetY,
                    shadow.blur
                );
            }
            else {
                disableShadow(context);
            }

            painter[me.name](context, me.points, action);

        },

        /**
         * 判断 point 是否在形状的矩形范围内
         *
         * @param {Object} point
         * @return {boolean}
         */
        inRect: function (point) {

            var rect = this.rect;

            return point.x > rect.x
                && point.x < rect.x + rect.width
                && point.y > rect.y
                && point.y < rect.y + rect.height;

        }

    };

    Shape.defaultOptions = {
        rect: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },
        shadow: {
            color: 'rgba(0,0,0,0.4)',
            offsetX: 2,
            offsetY: 2,
            blur: 4
        }
    };

    var painter = {
        doodle: require('./painter/doodle'),
        line: require('./painter/line'),
        rect: require('./painter/rect'),
        text: function () {

        },
        ellipse: require('./painter/ellipse'),
        arrow: require('./painter/arrow'),
        eraser: function (context, points) {
            context.save();
            context.strokeStyle = 'rgba(255,255,255,0)';

            context.shadowOffsetX =
            context.shadowOffsetY =
            context.shadowBlur = 0;

            require('./path/lines')(context, points);
            context.stroke();
            context.restore();
        }
    };

    return Shape;

});