/**
 * @file 生成全局唯一的 ID
 * @author musicode
 */
define(function (require, exports, module) {

    /**
     * 生成四位十六进制随机数
     *
     * @inner
     * @return {string}
     */
    function s4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return function () {
        return s4() + s4() + s4() + s4();
    };

});