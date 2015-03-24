/**
 * @file file
 * @author author
 */
define(function (require, exports, module) {

    'use strict';

    var retina = require('../util/retina');

    var circle = require('../path/circle');

    function draw

    exports.init = function () {

        var canvas = g('canvas');
        var context = canvas.getContext('2d');

        retina(canvas);

        circle(context, canvas.width / 2, canvas.height / 2, 200);

    };

});