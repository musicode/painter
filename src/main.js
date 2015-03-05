define(function (require, exports) {

    'use strict';

    var retina = require('./util/retina');
    var grid = require('./path/grid');
    var line = require('./path/line');
    var lines = require('./path/lines');
    var ellipse = require('./path/ellipse');
    var roundedRect = require('./path/roundedRect');

    exports.init = function () {

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        retina(canvas);

        context.lineWidth = 0.5;

        context.save();
        context.beginPath();
        context.strokeStyle = 'rgba(0,0,0,0.2)';
        grid(context, 10, 10);
        context.stroke();
        context.restore();

        context.beginPath();
        ellipse(context, 100, 100, 100, 60);
        context.stroke();

        context.beginPath();
        line(context, 0, 0, 200, 200);
        context.stroke();

        context.beginPath();
        lines(
            context,
            [
                { x: 0, y: 0 },
                { x: 10, y: 0 },
                { x: 20, y: 0 },
                { x: 20, y: 10 },
                { x: 30, y: 40 },
                { x: 10, y: 100 }
            ]
        );
        context.stroke();

        context.beginPath();
        roundedRect(context, 170, 50, 100, 60, 10);
        context.stroke();
    };

});