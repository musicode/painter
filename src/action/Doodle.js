/**
 * @file 涂鸦
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var inherits = require('../util/inherits');

    return inherits(
        require('./Action'),
        {
            name: 'doodle'
        }
    );

});