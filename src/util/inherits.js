/**
 * @file 继承
 * @author musicode
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 继承
     *
     * @param {Function} superClass 父类
     * @param {Object} subClass 子类扩展
     */
    return function (superClass, subClass) {

        // 创建一个新的构造函数
        var Class = function () {
            superClass.apply(this, arguments);
        };

        var superProto = superClass.prototype;
        var subProto = Class.prototype;

        $.extend(subProto, superProto, subClass);

        return Class;

    };

});