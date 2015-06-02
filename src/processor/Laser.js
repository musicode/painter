/**
 * @file 使用激光笔
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var Shape = require('../shape/Shape');

    var debounce = require('../util/debounce');
    var inherits = require('../util/inherits');

    return inherits(
        require('./Processor'),
        {
            name: 'laser',

            move: debounce(
                    function (point) {

                        var me = this;

                        me.shape = new Shape(point);

                        me.commit();

                    },
                    300
                )

        }
    );

});