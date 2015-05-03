/**
 * @file 使用箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var eventEmitter = require('../eventEmitter');

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
                    function () {
                        me.save();
                    }
                );

            },


            down: function (e) {

                var me = this;
                var shape = me.shape;

                if (shape) {

                    me.commit(true);

                    me.shape = null;

                }

            },
            move: function (e, point) {

                var me = this;
                var context = me.context;

                var canvas = context.canvas;
                var width = canvas.width;
                var height = canvas.height;

                me.restore();

                var target = null;

                $.each(
                    me.shapes,
                    function (index, shape) {

                        if (shape.adaptive) {
                            shape = shape.clone();
                            shape.toAdaptive(false, width, height);
                        }

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