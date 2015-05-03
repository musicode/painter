/**
 * @file 使用矩形
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('../style');

    var Shape = require('../shape/Rect');
    var inherits = require('../util/inherits');

    return inherits(
        require('./Processor'),
        {
            name: 'rect',

            down: function (e, point) {

                var me = this;

                me.save();

                me.startPoint = point;

                me.shape = new Shape({
                    x: point.x,
                    y: point.y,
                    shadowColor: 'rgba(0,0,0,0.2)',
                    shadowOffsetX: 1,
                    shadowOffsetY: 1,
                    shadowBlur: 1,
                    lineWidth: style.getLineWidth(),
                    strokeStyle: style.getStrokeStyle()
                });

            },
            move: function (e, point) {

                var me = this;
                var shape = me.shape;

                if (shape) {

                    me.restore();

                    var startPoint = me.startPoint;

                    var startX = Math.min(startPoint.x, point.x);
                    var startY = Math.min(startPoint.y, point.y);
                    var endX = Math.max(startPoint.x, point.x);
                    var endY = Math.max(startPoint.y, point.y);

                    shape.x = startX;
                    shape.y = startY;
                    shape.width = endX - startX;
                    shape.height = endY - startY;

                    shape.draw(me.context);

                }

            },
            up: function () {

                var me = this;

                var shape = me.shape;

                if (shape && shape.width > 0 && shape.height > 0) {

                    me.restore();

                    me.commit();

                    me.shape = null;
                }

            }
        }
    );

});