/**
 * @file 操作历史记录
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 历史纪录保存两个列表：
     *
     * fullList：保存完整的操作，包括删除操作，每个操作都会在执行前获取快照，以便回退
     *
     * liveList：保存存活的操作，删除操作会触发操作刷新快照
     *
     */

    var extend = require('./util/extend');
    var saveDrawingSurface = require('./util/saveDrawingSurface');
    var restoreDrawingSurface = require('./util/restoreDrawingSurface');

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

        indexOf: function (shape, type) {

            var index;

            this.iterator(
                function (action, i) {
                    if (action.shape === shape) {
                        index = i;
                        return false;
                    }
                },
                type
            );

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

console.time(action.type + '耗时');

                    action.save(context);

                    var type = action.type;
                    var shape = action.shape;

                    if (type === Action.REMOVE) {

                        var i = me.indexOf(shape, 'live');
                        liveList[ i ].restore(context);

                        liveList.splice(i, 1);

                        var len = liveList.length;

                        while (i < len) {
                            liveList[i].save(context);
                            liveList[i].do(context);
                            i++;
                        }


                        var snapshoot = saveDrawingSurface(context);

                        action.do = function () {
                            restoreDrawingSurface(context, snapshoot);
                        };

                    }
                    else {
                        liveList.push(
                            full2Live(action)
                        );

                        action.do(context);
                    }

                    action.index = index;

                    fullList[ index++ ] = action;


                    me.index = index;

console.timeEnd(type + '耗时');
console.log('liveList', liveList);

                }
            );

        },

        undo: function (context) {

            var me = this;

            var index = me.index - 1;
            var action = me.fullList[ index ];
console.log('undo', index, action);
            if (action) {

                if (!me.isRemovedAction(action)) {
                    me.liveList.pop();
                }

                action.restore(context);
                me.index = index;

            }

        },

        redo: function (context) {

            var me = this;
            var action = me.fullList[ me.index ];
console.log('redo', me.index, action);
            if (action) {

                if (!me.isRemovedAction(action)) {
                    me.liveList.push(
                        full2Live(action)
                    );
                }

                action.do(context);
                me.index++;

            }

        },

        /**
         * 内部调用
         *
         * @private
         * @param {Action}  action
         * @return {boolean}
         */
        isRemovedAction: function (action) {

            var me = this;

            var result = false;

            me.iterator(
                function (item) {
                    if (item.type === Action.REMOVE) {
                        result = true;
                        return false;
                    }
                }
            );

            return result;

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
                list = me.fullList;
                len = me.index;
            }

            for (var i = 0; i < len; i++) {
                if (handler(list[i], i) === false) {
                    break;
                }
            }

        }

    };

    function full2Live(action) {

        var item = new Action();

        return extend(item, action);

    }

    function noop() {

    }

    return History;

});