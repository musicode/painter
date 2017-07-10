/**
 * @file 点是否在线段上（不在其延长线上）
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    return function (x1, y1, x2, y2, x, y) {

        // 设点为 Q，线段为 P1P2，判断点 Q 在该线段上的依据是：
        // ( Q - P1 ) × ( P2 - P1 ) = 0

        var p1 = [ x1, y1 ];
        var p2 = [ x2, y2 ];


    };

});