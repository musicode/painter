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
        Text: require('./shape/Text'),
        Point: require('./shape/Point')
    };

    exports.object2Shape = function (shape) {

        var Shape = shapeMap[ shape.name ];

        return new Shape(shape);

    };

});