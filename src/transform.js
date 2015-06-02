/**
 * @file 转换器
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var shapeMap = {
        Shape: require('./shape/Shape'),
        Arrow: require('./shape/Arrow'),
        Doodle: require('./shape/Doodle'),
        Ellipse: require('./shape/Ellipse'),
        Circle: require('./shape/Circle'),
        Rect: require('./shape/Rect'),
        Text: require('./shape/Text')
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

});