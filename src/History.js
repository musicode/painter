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

        addAction: function (actions) {

            var me = this;

            // 准备数据
            var list = me.list;
            var index = me.index;

            // 放弃 index 之后的部分
            if (index < list.length) {
                list.length = index;
            }

            if (!Array.isArray(actions)) {
                actions = [ actions ];
            }

            actions.forEach(
                function (action) {

                    // 添加索引，方便删除
                    action.index = index;
                    list[ index ] = action;

                    index++;

                }
            );

            me.index = index;

        },

        removeAction: function (actions) {

            if (!Array.isArray(actions)) {
                actions = [ actions ];
            }

            // actions 按索引从小到大排序
            actions = actions.sort(
                function (a, b) {
                    return b.index - a.index;
                }
            );

            var me = this;
            var list = me.list;

            var current = actions.shift();
            var offset = 0;

            me.iterator(
                function (action, index) {
                    if (current && action.index === current.index) {

                        offset++;

                        list.splice(index, 1);
                        current = actions.shift();

                    }
                    else {
                        action.index -= offset;
                    }
                },
                current.index
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

        redo: function (context) {

            var me = this;
            var action = me.list[ me.index ];

            if (action) {
                action.do(context);
                me.index++;
            }

        },

        iterator: function (handler, startIndex) {

            var me = this;
            var list = me.list;

            var i = startIndex || 0;
            var len = me.index;

            while (i < len) {
                handler(list[i], i);
                i++;
            }

        }

    };

    return History;

});