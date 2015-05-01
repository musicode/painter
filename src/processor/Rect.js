/**
 * @file 使用矩形
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var Shape = require('../shape/Rect');
    var Action = require('../action/Rect');

    var inherits = require('../util/inherits');

    return inherits(
        require('./Processor'),
        {
            name: 'rect',

            down: function (e, point) {

                var me = this;

                me.save();

                me.startPoint = point;

                me.action = new Action({
                    shape: me.createShape(Shape)
                });

            },
            move: function (e, point) {

                var me = this;
                var action = me.action;

                if (action) {

                    me.restore();

                    var startPoint = me.startPoint;

                    var startX = Math.min(startPoint.x, point.x);
                    var startY = Math.min(startPoint.y, point.y);
                    var endX = Math.max(startPoint.x, point.x);
                    var endY = Math.max(startPoint.y, point.y);

                    me.updateAction({
                        x: startX,
                        y: startY,
                        width: endX - startX,
                        height: endY - startY
                    });

                    me.doAction();

                }

            },
            up: function () {

                var me = this;

                if (me.action) {

                    me.restore();

                    me.commit();

                    me.action = null;
                }

            }
        }
    );

});