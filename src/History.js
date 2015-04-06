/**
 * @file 操作历史记录
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var each = require('./util/each');
    var extend = require('./util/extend');
    var saveDrawingSurface = require('./util/saveDrawingSurface');
    var restoreDrawingSurface = require('./util/restoreDrawingSurface');

    var Action = require('./Action');

    /**
     *
     * @param {Object} options
     */
    function History(options) {
        extend(this, options);
        this.init();
    }

    History.prototype = {

        construtor: History,

        init: function () {

            var me = this;

            me.list = [ ];

            me.index = 0;

        },

        push: function (action) {

            var me = this;

            // 准备数据
            var list = me.list;
            var index = me.index;

            // 放弃 index 之后的部分
            if (index < list.length) {
                list.length = index;
            }

            list[ index++ ] = action;

            me.index = index;

            if (me.onPush) {
                me.onPush();
            }

        },

        undo: function (context) {

            var me = this;

            var index = me.index - 1;

            if (index >= 0) {

                me.index = index;

            }

        },

        redo: function (context) {

            var me = this;

            var index = me.index;

            if (me.list[index]) {
                me.index = index + 1;
            }

        },

        getLiveActionList: function () {

            var me = this;

            var list = [ ];
            var map = { };

            me.iterator(
                function (action, index) {

                    var actionType = action.type;
                    var shapeId = action.shape.id;

                    if (actionType === Action.ADD) {
                        map[ shapeId ] = index;
                        list.push(action);
                    }
                    else if (actionType === Action.REMOVE) {
                        index = map[ shapeId ];
                        if (index >= 0) {
                            list[ index ] = null;
                        }
                    }

                }
            );

            return list.filter(
                function (item) {
                    return item != null;
                }
            );

        },

        iterator: function (handler) {

            var me = this;

            var list = me.list;
            var len = me.index;

            for (var i = 0; i < len; i++) {
                if (handler(list[i], i) === false) {
                    break;
                }
            }

        }

    };


    function noop() {

    }

    return History;

});