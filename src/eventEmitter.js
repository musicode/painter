/**
 * @file 事件管理器
 * @author musicode
 */
define(function (require, exports) {

    'use strict';

    exports = $({});

    exports.ACTION_ADD = 'action_add';

    exports.ACTION_REMOVE = 'action_REMOVE';

    exports.SHAPE_ADD = 'shape_add';

    exports.SHAPE_REMOVE = 'shape_remove';

    exports.SAVE_DRAWING_SURFACE_ACTION = 'save_drawing_surface_action';

    exports.SAVE_DRAWING_SURFACE = 'save_drawing_surface';

    exports.RESTORE_DRAWING_SURFACE_ACTION = 'restore_drawing_surface_action';

    exports.RESTORE_DRAWING_SURFACE = 'restore_drawing_surface';

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