/**
 * @file 使用箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var style = require('../style');

    var Shape = require('../shape/Arrow');
    var inherits = require('../util/inherits');

    return inherits(
        require('./Processor'),
        {
            name: 'arrow',

            down: function (point) {

                var me = this;

                me.save();

                me.shape = new Shape({
                    x: point.x,
                    y: point.y,
                    thickness: style.getLineWidth(),
                    fillStyle: style.getFillStyle()
                });

            },

            move: function (point) {

                var me = this;
                var shape = me.shape;

                if (shape) {

                    me.restore();

                    shape.endX = point.x;
                    shape.endY = point.y;

                    shape.draw(me.context);

                }

            },

            up: function () {

                var me = this;
                var shape = me.shape;

                if (shape) {

                    me.restore();

                    if (shape.endX != null) {
                        me.commit();
                    }

                    me.shape = null;

                }

            }
        }
    );

});