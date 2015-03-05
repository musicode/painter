define(function (require, exports) {

    'use strict';

    var Painter = require('./Painter');

    exports.init = function () {

        var canvas = document.getElementById('canvas');
        var painter = new Painter(canvas);

        painter.retina();
        painter.grid(10, 10, 'rgba(0,0,0,0.2)');

    };

});