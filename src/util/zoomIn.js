/**
 * @file 放大点
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    function zoomIn(point, width, height) {

        return {
            x: point.x * width,
            y: point.y * height
        };

    }

    return function (point, width, height) {

        var len = point.length;

        if (len > 0) {

            var list = [ ];

            for (var i = 0; i < len; i++) {
                list.push(
                    zoomIn(point[i], width, height)
                );
            }

            return list;

        }
        else {

            return zoomIn(point, width, height);

        }

    }

});