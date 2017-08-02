/**
 * @file 获取圆上的点
 * @author musicode
 */
define(function () {

  return function (x, y, radius, radian) {
    return {
      x: x + radius * Math.cos(radian),
      y: y + radius * Math.sin(radian),
    }
  }

})