/**
 * @file 两个矩形是否有交集
 * @author musicode
 */
define(function (require, exports, module) {

  return function (rect1, rect2) {
    return rect1.y + rect1.height < rect2.y
      || rect1.y > rect2.y + rect2.height
      || rect1.x + rect1.width < rect2.x
      || rect1.x > rect2.x + rect2.width
  }

})