/**
 * @file 使用箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var Shape = require('../shape/Arrow');
    var Action = require('../action/Arrow');

    var inherits = require('../util/inherits');

    return inherits(
        require('./Processor'),
        {
            name: 'arrow',

            down: function (e, point) {

                var me = this;

                me.save();

                me.action = new Action({
                    shape: me.createShape(Shape, point)
                });

            },

            move: function (e, point) {

                var me = this;
                var action = me.action;

                if (action) {

                    me.restore();

                    me.updateAction({
                        endX: point.x,
                        endY: point.y
                    });

                    me.doAction();

                }

            },

            up: function () {

                var me = this;
                var action = me.action;

                if (action) {

                    if (action.shape.endX == null) {
                        return;
                    }

                    me.restore();
                    me.commit();

                    me.action = null;

                }

            }
        }
    );

});