/**
 * @file 判断点是否在矩形内
 * @author musicode
 */

/**
 * @param {Object} rect
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */
export default function (rect, x, y) {
  return x >= rect.x
    && x <= rect.x + rect.width
    && y >= rect.y
    && y <= rect.y + rect.height
}
