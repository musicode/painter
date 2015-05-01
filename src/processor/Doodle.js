/**
 * @file 使用画笔工具
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var Shape = require('../shape/Doodle');
    var Action = require('../action/Doodle');

    var inherits = require('../util/inherits');

    return inherits(
        require('./Processor'),
        {
            name: 'doodle',

            down: function (e, point) {

                var me = this;

                me.save();

                var options = {
                    x: point.x,
                    y: point.y,
                    points: me.points =  [ point ]
                };

                me.action = new Action({
                    shape: me.createShape(Shape, options)
                });

            },
            move: function (e, point) {

                var me = this;
                var action = me.action;

                if (action) {

                    me.restore();

                    var points = me.points;

                    points.push(point);

                    me.updateAction({
                        points: points
                    });

                    me.doAction();

                }

            },
            up: function (e) {

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