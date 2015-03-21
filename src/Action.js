/**
 * @file 操作
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var extend = require('./util/extend');
    var snapshoot = require('./util/snapshoot');

    /**
     * @param {Object} options
     * @property {string} options.type 操作类型，可选值有 add remove
     * @property {number} options.index 当前操作在历史纪录中的索引
     * @property {Shape} options.shape
     * @property {ImageData} options.snapshoot 操作之前的快照
     */
    function Action(options) {
        extend(this, options);
        this.init();
    }

    Action.prototype = {

        constructor: Action,

        init: function () {

        },

        do: function (context) {

            var me = this;

            me.shape.draw(context);

            me.after = snapshoot(context);

        },

        /**
         * 回到操作之前的快照
         */
        undo: function (context) {
            context.putImageData(this.snapshoot, 0, 0);
        },

        /**
         * 回到操作之后的快照
         */
        redo: function (context) {
            context.putImageData(this.after, 0, 0);
        },

        refresh: function (context) {

            var me = this;

            me.snapshoot = snapshoot(context);
            me.do();
        }
    };

    Action.ADD = 'add';

    Action.REMOVE = 'remove';


    return Action;

});