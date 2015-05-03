/**
 * @file 绘图表面
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var saveDrawingSurface = require('./util/saveDrawingSurface');
    var restoreDrawingSurface = require('./util/restoreDrawingSurface');

    function DrawingSurface() {

    }

    DrawingSurface.prototype = {

        constructor: DrawingSurface,

        save: function (context) {

            this.imageData = saveDrawingSurface(context);

        },

        restore: function (context) {

            restoreDrawingSurface(context, this.imageData);

        },

        getImageData: function () {
            return this.imageData;
        }

    };


    return DrawingSurface;

});