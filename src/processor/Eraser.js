/**
 * @file 使用箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var eventEmitter = require('../eventEmitter');
    var Action = require('../action/Eraser');

    var inherits = require('../util/inherits');

    return inherits(
        require('./Processor'),
        {

            name: 'eraser',

            initExtend: function () {

                var me = this;

                me.save();

                eventEmitter.on(
                    eventEmitter.SHAPE_REMOVE,
                    function (e, data) {
                        me.save();
                    }
                );

            },


            down: function (e) {

                var me = this;
                var shape = me.shape;

                if (shape) {

                    me.action = new Action({
                        shape: shape
                    });

                    me.commit(true);

                    me.action = null;

                }

            },
            move: function (e, point) {

                var me = this;
                var context = me.context;

                me.restore();

                var target = null;

                me.iterator(
                    function (shape) {
                        if (shape.isPointInPath(context, point)) {
                            target = shape;
                        }
                    }
                );

                if (target) {
                    target.createBoundaryPath(context);
                    context.save();
                    context.fillStyle = 'rgba(0,0,0,0.2)';
                    context.fill();
                    context.restore();
                }

                me.shape = target;

            }
        }
    );

});