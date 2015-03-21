/**
 * @file 操作历史记录
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var extend = require('./util/extend');

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

        addAction: function (action) {

            var me = this;
            var index = me.index;
            var list = me.list;

            if (index < list.length) {
                list.length = index;
            }

            list[index] = action;

            // 添加索引，方便删除
            action.index = index;

            me.index++;

            if (typeof me.onAdd === 'function') {
                me.onAdd()
            }

        },

        removeAction: function (actions) {

            if (!Array.isArray(actions)) {
                actions = [ actions ];
            }

            if (actions.length === 0) {
                return;
            }

            // actions 按索引倒序排列，方便删除
            actions = actions.sort(
                function (a, b) {
                    return b.index - a.index;
                }
            );

            var me = this;
            var list = me.list;

            var offset = 0;

            actions.forEach(
                function (action) {
                    list.splice(action.index, 1);
                    if (action.index < me.index) {
                        offset++;
                    }
                }
            );

            me.index -= offset;

        },

        undo: function (context) {

            var me = this;

            var index = me.index - 1;
            var action = me.list[ index ];

            if (action) {
                action.undo(context);
                me.index = index;
            }

        },

        redo: function () {

            var me = this;

            var action = me.list[ me.index ];

            if (action) {
                action.redo(context);
                me.index++;
            }

        },

        iterator: function (handler, startIndex) {

            var me = this;
            var list = me.list;

            for (var i = startIndex || 0, len = me.index; i < len; i++) {
                handler(list[i], i);
            }

        }

    };

    return History;

});