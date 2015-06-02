/**
 * @file 使用箭头
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var eventEmitter = require('../eventEmitter');
    var config = require('../config');

    var inherits = require('../util/inherits');

    return inherits(
        require('./Processor'),
        {

            name: 'eraser',

            initExtend: function () {

                var me = this;

                me.save();

                var saveHandler = function () {
                    me.save();
                };

                eventEmitter.on(
                    eventEmitter.SHAPE_REMOVE,
                    saveHandler
                );

                eventEmitter.on(
                    eventEmitter.SHAPE_CLEAR,
                    saveHandler
                );

            },


            down: function () {

                var me = this;
                var shape = me.shape;

                if (shape) {
                    me.commit(true);
                    me.shape = null;
                }

            },
            move: function (point, e) {

                var target = $(e.target);

                var selector = [ 'canvas' ];

                var customCursorSelector = config.customCursorSelector;
                if (customCursorSelector) {
                    selector.push(customCursorSelector);
                }

                if (!target.is(selector.join(','))) {
                    return;
                }

                var me = this;
                var shapes = me.shapes;

                if (shapes.length === 0) {
                    return;
                }

                me.restore();

                var target = null;

                $.each(
                    shapes,
                    function (index, shape) {
                        if (shape.testPoint(point)) {
                            target = shape;
                        }
                    }
                );

                if (target) {

                    var context = me.context;

                    target.createBoundaryPath(context);
                    context.save();
                    context.fillStyle = 'rgba(255,123,0,0.3)';
                    context.fill();
                    context.restore();

                }

                me.shape = target;

            }
        }
    );

});