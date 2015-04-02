/**
 * @file 操作
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var extend = require('./util/extend');

    /**
     * @param {Object} options
     * @property {string} options.type 操作类型，可选值有 add remove
     * @property {Shape=} options.shape 形状
     */
    function Action(options) {
        extend(this, options);
    }

    Action.addAction = function (shape) {
        return new Action({
            type: Action.ADD,
            shape: shape
        });
    };

    Action.removeAction = function (shape) {
        return new Action({
            type: Action.REMOVE,
            shape: shape
        });
    };

    Action.ADD = 'add';

    Action.REMOVE = 'remove';


    return Action;

});