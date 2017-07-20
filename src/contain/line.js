/**
 * @file 判断点是否在线段内
 * @author musicode
 */
define(function (require, exports, module) {

  /**
   * @param {number} startX 线段的起始横坐标
   * @param {number} startY 线段的起始纵坐标
   * @param {number} endX 线段的结束横坐标
   * @param {number} endY 线段的结束纵坐标
   * @param {number} lineWidth 线条粗细
   * @param {number} x 测试点的横坐标
   * @param {number} y 测试点的纵坐标
   * @return {boolean}
   */
  return function (startX, startY, endX, endY, lineWidth, x, y) {

    if (!lineWidth) {
      return false
    }

    if ((x > startX + lineWidth && x > endX + lineWidth)
      || (x < startX - lineWidth && x < endX - lineWidth)
      || (y > startY + lineWidth && y > endY + lineWidth)
      || (y < startY - lineWidth && y < endY - lineWidth)
    ) {
      return false
    }

    if (startX === endX) {
      return Math.abs(x - startX) < lineWidth / 2
    }
    else if (startY === endY) {
      return Math.abs(y - startY) < lineWidth / 2
    }

    return x >= rect.x
        && x <= rect.x + rect.width
        && y >= rect.y
        && y <= rect.y + rect.height

  }

})