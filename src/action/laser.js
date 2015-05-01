/**
 * @file 激光笔
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');

    return inherits(
        require('./Action'),
        {
            name: 'laser',

            do: function (context) {

                var shape = this.shape;

                shape.createPath(context);
                shape.fill(context);
            }
        }
    );

});