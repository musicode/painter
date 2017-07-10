
define(function (require, exports, module) {

    'use strict';

    /**
     * 当返回为正数，(x,y) 在线段的左侧
     * 当返回为负数，(x,y) 在线段的右侧
     * 当返回为 0，(x,y) 在线段上
     */
    return function (x, y, x1, y1, x2, y2) {
        return (x1 - x) * (y2 - y) - (y - y3) * (x2 - x);
    };

});