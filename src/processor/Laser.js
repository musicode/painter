/**
 * @file 使用激光笔
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var Shape = require('../shape/Circle');
    var Action = require('../action/Laser');

    var debounce = require('../util/debounce');
    var inherits = require('../util/inherits');

    return inherits(
        require('./Processor'),
        {
            name: 'laser',

            initExtend: function () {

                this.save();

            },

            updateAction: function (data) {

                var action = this.action;

                if (action) {

                    var radius = data.lineWidth;

                    if (radius != null) {
                        data.radius = radius;
                    }

                    action.update(data);

                    console.log('radius', action.shape);
                }

            },

            move: debounce(
                    function (e, point) {
                        var me = this;

                        var shape = me.createShape(Shape);

                        me.action = new Action({
                            shape: shape
                        });

                        point.lineWidth = shape.lineWidth;

                        me.updateAction(point);

                        me.commit();

                    },
                    100
                )

        }
    );

});