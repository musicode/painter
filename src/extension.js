/**
 * @file 工具类
 */
define(function (require, exports) {

    'use strict';

    var config = require('./config');

    exports.getCanvasPoint = function (point, canvas) {

        var offset = canvas.offset();

        point.x -= offset.left;
        point.y -= offset.top;

        var devicePixelRatio = config.devicePixelRatio;

        return {
            x: point.x * devicePixelRatio,
            y: point.y * devicePixelRatio
        };
    };

});