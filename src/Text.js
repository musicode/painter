/**
 * @file 文字工具
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    function Text(options) {

    }

    var canvas2Window = require('../util/canvas2Window');

    var textarea;

    function createTextarea(point) {

        var div = document.createElement('div');

        var style = 'position:absolute;'
                  + 'left:' + point.x + 'px;'
                  + 'top:' + point.y + 'px;';

        div.innerHTML = '<textarea class="canvas-textarea" style="'
                      + style
                      + '"></textarea>';

        return div.firstChild;

    }

    var point = shape.points[0];

    textarea = createTextarea(
        canvas2Window(context.canvas, point.x, point.y)
    );

    var body = document.body;
    body.appendChild(textarea);

    setTimeout(
        function () {

            textarea.focus();

            textarea.onblur = function () {

                var text = textarea.value.trim();
                if (text) {

                    shape.text = text;
                    shape.x = point.x;
                    shape.y = point.y;

                    context.textAlign = 'start';
                    context.textBaseLine = 'top';

                    context.fillText(shape.text, shape.x, shape.y);
                }

                body.removeChild(textarea);
                textarea = null;

            };
        }
    );

    return Text;

});