/**
 * @file file
 * @author author
 */
define(function (require, exports, module) {

    'use strict';

    var retina = require('../util/retina');

    var circle = require('../path/circle');

    function g(id) {
        return document.getElementById(id);
    }

    exports.init = function () {

        var canvas = g('canvas');
        var context = canvas.getContext('2d');

        retina(canvas);

        var width = canvas.width;
        var height = canvas.height;

        var x = width / 2;
        var y = height / 2;
        var radius = Math.min(width / 2, height / 2) - 100;

        var angle = 0;
        var unit = 2 * Math.PI / 64;

        context.beginPath();
        context.moveTo(x + radius, y);

        while (angle <= 2 * Math.PI) {

            context.lineTo(
                x + radius * Math.cos(angle),
                y + radius * Math.sin(angle)
            );

            angle += unit;

        }

        context.stroke();




    };

});