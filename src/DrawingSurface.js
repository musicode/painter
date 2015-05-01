/**
 * @file 绘图表面
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var saveDrawingSurface = require('./util/saveDrawingSurface');
    var restoreDrawingSurface = require('./util/restoreDrawingSurface');

    /**
     * @param {Object} options
     * @property {CanvasRenderingContext2D} context
     */
    function DrawingSurface(options) {
        $.extend(this, options);
    }

    DrawingSurface.prototype = {

        constructor: DrawingSurface,

        save: function () {

            var me = this;

            me.imageData = saveDrawingSurface(me.context);

        },

        restore: function () {

            var me = this;

            restoreDrawingSurface(me.context, me.imageData);

        }

    };


    return DrawingSurface;

});