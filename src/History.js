/**
 * @file 操作历史记录
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    var extend = require('./util/extend');
    var Action = require('./Action');

    /**
     *
     * @param {Object} options
     * @property {CanvasRenderingContext2D} options.context
     */
    function History(options) {
        extend(this, options);
        this.init();
    }

    History.prototype = {

        construtor: History,

        init: function () {

            var me = this;

            me.fullList = [ ];

            me.liveList = [ ];

            me.index = 0;

        },

        indexOf: function (shape) {

            var index;

            var me = this;
            var fullList = me.fullList;

            for (var i = 0, len = me.index; i < len; i++) {
                if (fullList[i].shape === shape) {
                    index = i;
                    break;
                }
            }

            return index;

        },

        push: function (actions) {

            var me = this;

            // 准备数据
            var fullList = me.fullList;
            var index = me.index;

            // 放弃 index 之后的部分
            if (index < fullList.length) {
                fullList.length = index;
            }

            if (!Array.isArray(actions)) {
                actions = [ actions ];
            }

            var context = me.context;
            var liveList = me.liveList;

            actions.forEach(
                function (action) {

                    action.save(context);

                    if (action.type === Action.REMOVE) {

                        var removedIndex = me.indexOf(action.shape);

                        liveList.splice(removedIndex, 1);

                        action.do = Action.removeFactory(
                            fullList[ removedIndex ],
                            fullList.slice(removedIndex + 1, index)
                        );

                    }
                    else {
                        liveList.push(action);
                    }

                    action.do(context);

                    fullList[ index++ ] = action;

                    me.index = index;

                }
            );

        },

        undo: function (context) {

            var me = this;

            var index = me.index - 1;
            var action = me.fullList[ index ];

            if (action) {

                if (action.type === Action.ADD) {
                    me.liveList.pop();
                }

                action.undo(context);
                me.index = index;

            }

        },

        redo: function (context) {

            var me = this;
            var action = me.fullList[ me.index ];

            if (action) {

                if (action.type === Action.ADD) {
                    me.liveList.push(action);
                }

                action.do(context);
                me.index++;

            }

        },

        iterator: function (handler, type) {

            var me = this;

            var list;
            var len;

            if (type === 'live') {
                list = me.liveList;
                len = list.length;
            }
            else {
                list = fullList;
                len = me.index;
            }

            for (var i = 0; i < len; i++) {
                if (handler(list[i], i) !== false) {
                    i++;
                }
                else {
                    break;
                }
            }

        }

    };

    return History;

});