/**
 * @file 矩阵
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    function Matrix(a, b, c, d, tx, ty) {

        var me = this;

        me.a = getDefaultValue(a, 1);
        me.b = getDefaultValue(b, 0);
        me.c = getDefaultValue(c, 0);
        me.d = getDefaultValue(d, 1);
        me.tx = getDefaultValue(tx, 0);
        me.ty = getDefaultValue(ty, 0);

    }

    Matrix.prototype = {

        constructor: Matrix,

        translate: function (dx, dy) {

        },

        scale: function (sx, sy) {

        },

        rotate: function (radian) {

        }

    };

    function getDefaultValue(value, defaultValue) {
        return $.type(value) === 'number'
             ? value
             : defaultValue;
    }

    return Matrix;

});
