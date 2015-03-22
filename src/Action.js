/**
 * @file 操作
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var extend = require('./util/extend');
    var saveDrawingSurface = require('./util/saveDrawingSurface');
    var restoreDrawingSurface = require('./util/restoreDrawingSurface');

    /**
     * @param {Object} options
     * @property {string} options.type 操作类型，可选值有 add remove
     * @property {number=} options.index 当前操作在历史纪录中的索引
     * @property {Shape} options.shape 形状
     * @property {ImageData} options.snapshoot 操作之前的快照
     */
    function Action(options) {
        extend(this, options);
    }

    Action.prototype = {

        constructor: Action,

        /**
         * 执行操作
         */
        do: function (context) {
            this.shape.draw(context);
        },

        /**
         * 回到操作之前的快照
         */
        undo: function (context) {
            restoreDrawingSurface(context, this.snapshoot);
        },

        /**
         * 刷新，包括刷新快照
         */
        refresh: function (context) {

            var me = this;

            me.snapshoot = saveDrawingSurface(context);
            me.do(context);

        }
    };

    Action.ADD = 'add';

    Action.REMOVE = 'remove';


    return Action;

});