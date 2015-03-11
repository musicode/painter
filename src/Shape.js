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
    var randomColor = require('./util/randomColor');

    /**
     *
     * @param {Object} options
     * @property {Array.<Object>} options.points 用户操作产生的轨迹点
     * @property {string} options.action 操作类型，如 add remove
     * @property {string} options.name 形状名称
     *
     * @property {number} options.x
     * @property {number} options.y
     * @property {number} options.z
     * @property {number} options.width
     * @property {number} options.height
     *
     * @property {ImageData} options.snapshoot
     *
     * @property {string} options.text 文本
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
     *
     */
    function Shape(options) {
        extend(this, Shape.defaultOptions, options);
        this.init();
    }

    Shape.prototype = {

        constructor: Shape,

        init: function () {

            var me = this;

            me.randomColor = randomColor(0.1);

            if (me.points) {
                extend(me, getRect(me.points));
            }

        },

        addPoint: function (point) {

            var me = this;

            me.points.push(point);

            extend(
                me,
                getRect([
                    { x: me.x, y: me.y },
                    { x: me.x + me.width, y: me.y + me.height },
                    point
                ])
            );

        },

        /**
         * 创建 shape 过程中会创建很多没用的点，这里需要精简一下
         *
         * 比如线条只有起点和终点有意义
         *
         */
        trim: function () {

            var me = this;

            me.points = painters[me.name].trim(me.points);

            extend(me, getRect(me.points));

        },

        draw: function (context, action) {

            var me = this;

            var style = me.style;

            if (style) {
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

            var painter = painters[me.name];
            if (painter) {
                return painter.draw(context, me, action);
            }

        },

        undo: function (context) {

            context.putImageData(this.snapshoot, 0, 0);

        },

        /**
         * 判断 point 是否在形状的矩形范围内
         *
         * @param {Object} point
         * @return {boolean}
         */
        inRect: function (point) {

            var me = this;

            return point.x > me.x
                && point.x < me.x + me.width
                && point.y > me.y
                && point.y < me.y + me.height;

        },

        highlight: function (context) {

            var me = this;

            context.save();

            context.fillStyle = me.randomColor;
            context.beginPath();

            context.rect(me.x, me.y, me.width, me.height);

            context.fill();

            context.restore();


        },

        nohighlight: function () {

        }

    };

    Shape.defaultOptions = {
        z: 0,
        shadow: {
            color: 'rgba(0,0,0,0.4)',
            offsetX: 2,
            offsetY: 2,
            blur: 4
        }
    };

    var painters = {
        doodle: require('./painter/doodle'),
        line: require('./painter/line'),
        rect: require('./painter/rect'),
        ellipse: require('./painter/ellipse'),
        arrow: require('./painter/arrow'),
        text: require('./painter/text')
    };

    return Shape;

});