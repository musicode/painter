/**
 * @file 事件管理器
 * @author musicode
 */
define(function (require, exports) {

    'use strict';

    exports = $({});

    /**
     * 触发添加形状
     *
     * @type {string}
     */
    exports.SHAPE_ADD_TRIGGER = 'shape_add_trigger';

    /**
     * 触发删除形状
     *
     * @type {string}
     */
    exports.SHAPE_REMOVE_TRIGGER = 'shape_remove_trigger';

    /**
     * 添加形状
     *
     * @type {string}
     */
    exports.SHAPE_ADD = 'shape_add';

    /**
     * 删除形状
     *
     * @type {string}
     */
    exports.SHAPE_REMOVE = 'shape_remove';

    /**
     * 清空形状
     *
     * @type {string}
     */
    exports.SHAPE_CLEAR = 'shape_clear';

    /**
     * 画笔线条粗细改变时触发
     *
     * @type {string}
     */
    exports.LINE_WIDTH_CHANGE = 'line_width_change';

    /**
     * 画笔描边颜色改变时触发
     *
     * @type {string}
     */
    exports.STROKE_STYLE_CHANGE = 'stroke_style_change';

    /**
     * 画笔填充颜色改变时触发
     *
     * @type {string}
     */
    exports.FILL_STYLE_CHANGE = 'fill_style_change';

    /**
     * 字体大小改变时触发
     *
     * @type {string}
     */
    exports.FONT_SIZE_CHANGE = 'font_size_change';


    return exports;

});