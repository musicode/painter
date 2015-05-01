/**
 * @file 文本
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');

    return inherits(
        require('./Action'),
        {
            name: 'text',

            do: function (context) {
                this.shape.fill(context);
            }

        }
    );

});