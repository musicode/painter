define(function (require, exports) {

    'use strict';

    var Painter = require('./Main');

    var retina = require('./util/retina');

    var grid = require('./path/grid');
    var line = require('./path/line');
    var lines = require('./path/lines');
    var ellipse = require('./path/ellipse');
    var roundedRect = require('./path/roundedRect');

    function g(id) {
        return document.getElementById(id);
    }

    exports.init = function () {

        var canvas = g('canvas');
        var context = canvas.getContext('2d');

        var thicknessInput = g('input-thickness');
        thicknessInput.oninput = function () {
            context.lineWidth = this.value;
        };
        var colorInput = g('input-color');
        colorInput.oninput = function () {
            context.strokeStyle =
            context.fillStyle = this.value;
        };

        document.body.onchange = function (e) {
            var target = e.target;
            if (target.tagName === 'INPUT') {
                if (target.name === 'shape') {
                    painter.paint({
                        name: target.value,
                        thickness: context.lineWidth,
                        fillColor: context.fillStyle,
                        strokeColor: context.strokeStyle
                    });
                }
                else if (target.name === 'eraser') {
                    painter.erase();
                }
            }
        };



        var painter = new Painter({
            context: context
        });

        retina(canvas);

        painter.paint({
            name: 'doodle'
        });

        context.lineWidth = 0.5;
        context.lineCap = 'round';

        context.save();
        context.beginPath();
        context.strokeStyle = 'rgba(0,0,0,0.1)';
        grid(context, 10, 10);
        context.stroke();
        context.restore();
    };

});