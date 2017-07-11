/**
 * @file 动画循环
 * @author musicode
 */
define(function (require, exports, module) {

  const requestAnimationFrame =
    window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (callback) {
         window.setTimeout(callback, 1000 / 60);
       }

  return function (callback) {

    let loop = function () {
      requestAnimationFrame(loop)
      callback()
    }

    loop()
  }

});