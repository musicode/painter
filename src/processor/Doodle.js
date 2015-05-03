/**
 * @file 使用画笔工具
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('../style');

    var Shape = require('../shape/Doodle');
    var inherits = require('../util/inherits');

    return inherits(
        require('./Processor'),
        {
            name: 'doodle',

            down: function (e, point) {

                var me = this;

                me.save();

                me.shape = new Shape({
                    x: point.x,
                    y: point.y,
                    points: [ point ],
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

                    shape.points.push(point);

                    shape.draw(me.context);

                }

            },
            up: function (e) {

                var me = this;

                if (me.shape) {

                    me.restore();

                    me.commit();

                    me.shape = null;

                }

            }
        }
    );

});