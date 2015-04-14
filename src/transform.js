/**
 * @file 转换器
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var shapeMap = {
        Arrow: require('./shape/Arrow'),
        Doodle: require('./shape/Doodle'),
        Ellipse: require('./shape/Ellipse'),
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