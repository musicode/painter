/**
 * @file 转换器
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var shapeMap = {
        Arrow: require('./shape/Arrow'),
        Doodle: require('./shape/Doodle'),
        Ellipse: require('./shape/Ellipse'),
        Circle: require('./shape/Circle'),
        Rect: require('./shape/Rect'),
        Text: require('./shape/Text')
    };

    var actionMap = {
        arrow: require('./action/Arrow'),
        laser: require('./action/Laser'),
        doodle: require('./action/Doodle'),
        rect: require('./action/Rect'),
        text: require('./action/Text')
    };

    exports.shape2Object = function (shape) {

        var data = { };

        $.each(
            shape,
            function (key, value) {

                if (!$.isFunction(shape[ key ])) {
                    data[ key ] = value;
                }

            }
        );

        return data;

    };

    exports.object2Shape = function (shape) {

        var Shape = shapeMap[ shape.name ];

        return $.extend(new Shape(), shape);

    };

    exports.action2Object = function (action) {

        return {
            name: action.name,
            shape: exports.shape2Object(action.shape)
        };

    };

    exports.object2Action = function (action) {

        var Action = actionMap[ action.name ];

        return new Action({
            shape: exports.object2Shape(action.shape)
        });

    };


});