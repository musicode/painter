/**
 * @file 桃心
 * @author wangtianhua
 */
define(function (require) {

    let getOffsetX = function (x, radius, radian) {
      return x + radius * (16 * Math.pow(Math.sin(radian), 3));
    }

    let getOffsetY = function (y, radius, radian) {
      return y - radius * (13 * Math.cos(radian) - 5 * Math.cos(2 * radian) - 2 * Math.cos(3 * radian) - Math.cos(4 * radian));
    }

    return {
        getOffsetX: getOffsetX,
        getOffsetY: getOffsetY
    };
});