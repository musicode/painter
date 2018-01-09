/**
 * @file 两个矩形的交集
 * @author musicode
 */
export default function (rect1, rect2) {
  let left = Math.max(rect1.x, rect2.x)
  let top = Math.max(rect1.y, rect2.y)
  let right = Math.min(rect1.x + rect1.width, rect2.x + rect2.width)
  let bottom = Math.min(rect1.y + rect1.height, rect2.y + rect2.height)
  if (right - left >= 0 && bottom - top >= 0) {
    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    }
  }
}
